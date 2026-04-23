
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = 3000;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  app.use(express.json());

  // In-memory "Database"
  const db = {
    users: [] as any[],
    drivers: [] as any[],
    merchants: [] as any[],
    artisans: [] as any[],
    pharmacies: [] as any[],
    doctors: [] as any[],
    orders: [] as any[],
    deliveries: {} as Record<string, { lat: number, lng: number, status: string }>,
    trips: {} as Record<string, { driverLoc?: { lat: number, lng: number }, clientLoc?: { lat: number, lng: number }, destination: string }>
  };

  // Socket.io Logic
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-trip", (tripId) => {
      socket.join(`trip-${tripId}`);
      console.log(`Socket ${socket.id} joined trip-${tripId}`);
      
      if (db.trips[tripId]) {
        socket.emit("trip-update", db.trips[tripId]);
      }
    });

    socket.on("maraude-request", (request) => {
      // Broadcast to all nearby drivers (real applications would filter by distance)
      io.emit("new-maraude-request", request);
      console.log("New Maraude Request broadcasted:", request.id);
    });

    socket.on("negotiate-price", ({ requestId, sender, text, price }) => {
      // Broadcast negotiation messages to the specific request room
      io.emit(`negotiation-${requestId}`, { sender, text, price, timestamp: Date.now() });
    });

    socket.on("update-trip-location", ({ tripId, role, lat, lng }) => {
      if (!db.trips[tripId]) {
        db.trips[tripId] = { destination: "" };
      }
      
      if (role === "driver") {
        db.trips[tripId].driverLoc = { lat, lng };
      } else if (role === "client") {
        db.trips[tripId].clientLoc = { lat, lng };
      }
      
      io.to(`trip-${tripId}`).emit("trip-update", db.trips[tripId]);
    });

    socket.on("join-delivery", (deliveryId) => {
      socket.join(`delivery-${deliveryId}`);
      console.log(`Socket ${socket.id} joined delivery-${deliveryId}`);
      
      // Send initial position if exists
      if (db.deliveries[deliveryId]) {
        socket.emit("delivery-update", db.deliveries[deliveryId]);
      }
    });

    socket.on("update-delivery-location", ({ deliveryId, lat, lng, status }) => {
      db.deliveries[deliveryId] = { lat, lng, status };
      io.to(`delivery-${deliveryId}`).emit("delivery-update", { lat, lng, status });
      console.log(`Delivery ${deliveryId} updated:`, { lat, lng, status });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // API Routes
  app.post("/api/register", (req, res) => {
    const user = req.body;
    db.users.push(user);
    console.log("User registered:", user.name);
    res.json({ success: true, user });
  });

  app.post("/api/drivers/register", (req, res) => {
    const driver = req.body;
    db.drivers.push(driver);
    console.log("Driver registered:", driver.firstName);
    res.json({ success: true, driver });
  });

  app.get("/api/drivers/nearby", (req, res) => {
    // Return registered drivers + some mock ones to ensure the radar always shows something
    const mockDrivers = [
      { id: 'm1', name: 'Ousmane B.', type: 'TAXI', rating: 4.7, distance: 0.2, location: { lat: 0.39, lng: 9.45 }, currentDestination: 'Akanda' },
      { id: 'm2', name: 'Moussa K.', type: 'TAXI', rating: 4.8, distance: 0.4, location: { lat: 0.38, lng: 9.46 }, currentDestination: 'Nzeng-Ayong' },
    ];
    
    const registeredDrivers = db.drivers.map(d => ({
      id: d.id || Math.random().toString(36).substr(2, 9),
      name: `${d.firstName} ${d.lastName}`,
      type: d.vehicleType,
      rating: 5.0,
      distance: Math.random() * 0.5,
      location: { lat: 0.39 + (Math.random() - 0.5) * 0.01, lng: 9.45 + (Math.random() - 0.5) * 0.01 },
      currentDestination: 'Libreville'
    }));

    res.json([...registeredDrivers, ...mockDrivers]);
  });

  app.post("/api/merchants/register", (req, res) => {
    const merchant = req.body;
    db.merchants.push(merchant);
    res.json({ success: true, merchant });
  });

  app.post("/api/artisans/register", (req, res) => {
    const artisan = req.body;
    db.artisans.push(artisan);
    res.json({ success: true, artisan });
  });

  app.post("/api/pharmacies/register", (req, res) => {
    const pharmacy = req.body;
    db.pharmacies.push(pharmacy);
    res.json({ success: true, pharmacy });
  });

  app.post("/api/doctors/register", (req, res) => {
    const doctor = req.body;
    db.doctors.push(doctor);
    res.json({ success: true, doctor });
  });

  // AI Routes
  app.post("/api/ai/medical-orientation", async (req, res) => {
    try {
      const { symptoms } = req.body;
      const prompt = `Tu es un assistant médical d'orientation au Gabon. Un patient décrit ses symptômes : "${symptoms}".
      Analyse la demande et réponds en JSON avec :
      1. "specialty" : la catégorie de médecin recommandée parmi : generaliste, pediatre, gynecologue, dentiste, ophtalmo, urologue, diabetologue, urgence.
      2. "advice" : un conseil bref de premier secours (ex: boire de l'eau, rester allongé).
      3. "urgencyLevel" : un score de 1 à 5 (5 étant une urgence vitale).
      4. "message" : un message d'orientation bienveillant.
      IMPORTANT : Ajoute toujours une mention que ceci n'est pas un diagnostic final et qu'il faut consulter.`;

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              specialty: { type: Type.STRING },
              advice: { type: Type.STRING },
              urgencyLevel: { type: Type.NUMBER },
              message: { type: Type.STRING }
            },
            required: ["specialty", "advice", "urgencyLevel", "message"]
          }
        }
      });
      res.json(JSON.parse(result.text || "{}"));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "AI Error" });
    }
  });

  app.post("/api/ai/artisan-diagnosis", async (req, res) => {
    try {
      const { problemDescription } = req.body;
      const prompt = `Tu es un expert en maintenance domestique au Gabon. Un client décrit son problème : "${problemDescription}".
      Analyse la demande et réponds en JSON avec :
      1. "category" : le métier nécessaire parmi : plomberie, electricite, froid, maconnerie, menuiserie, carrelage, menage, nettoyage, charpenterie, elagage, mecanique.
      2. "advice" : un conseil bref de sécurité.
      3. "priceRange" : une estimation du prix à Libreville.`;

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              advice: { type: Type.STRING },
              priceRange: { type: Type.STRING }
            },
            required: ["category", "advice", "priceRange"]
          }
        }
      });
      res.json(JSON.parse(result.text || "{}"));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "AI Error" });
    }
  });

  app.post("/api/ai/chat-response", async (req, res) => {
    try {
      const { name, message } = req.body;
      const prompt = `Tu es ${name}, prestataire au Gabon (Libreville). Un client te dit : "${message}". Réponds court, professionnel et chaleureux (style local).`;
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });
      res.json({ text: result.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "AI Error" });
    }
  });

  app.post("/api/ai/neighborhood", async (req, res) => {
    try {
      const { lat, lng } = req.body;
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: `Identifie le quartier à Libreville pour : Lat ${lat}, Lng ${lng}. Format court.` }] }]
      });
      res.json({ neighborhood: result.text?.trim() || "Libreville" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "AI Error" });
    }
  });

  app.post("/api/ai/negotiate", async (req, res) => {
    try {
      const { currentPrice, offer, road, weather, passengers, hasLuggage } = req.body;
      const prompt = `Chauffeur à Libreville. Prix de base estimé: ${currentPrice}. Client propose: ${offer}. 
      Contexte supplémentaire: Route: ${road}, Météo: ${weather}, Passagers: ${passengers || 1}, Bagages: ${hasLuggage ? 'Oui' : 'Non'}.
      Réponds en JSON: reply (style gabonais, accepte ou négocie avec humour) et finalPrice (nombre).`;

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              finalPrice: { type: Type.NUMBER }
            },
            required: ["reply", "finalPrice"]
          }
        }
      });
      res.json(JSON.parse(result.text || "{}"));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "AI Error" });
    }
  });

  app.post("/api/ai/predict-direction", async (req, res) => {
    try {
      const { history } = req.body;
      const prompt = `Tu es une IA de logistique à Libreville. Voici l'historique des dernières destinations d'un taxi : ${history.join(', ')}. 
      En te basant sur les habitudes de transport locales au Gabon et cet historique, prédis la prochaine destination la plus probable.
      Réponds uniquement avec le nom du quartier/lieu (ex: Aéroport, Owendo, Louis).`;
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });
      res.json({ prediction: result.text?.trim() || "Aéroport Léon Mba" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "AI Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
