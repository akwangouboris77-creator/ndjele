
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import { GoogleGenAI, Type } from "@google/genai";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic Cryptographic Secret for token signing (resilient to standard signature forgery)
const SERVER_SECRET = crypto.randomBytes(32).toString("hex");

// Cryptographic Token Helpers (rely on SHA256 HMAC of session payload + expiration timestamp)
function generateSecureToken(userId: string): string {
  const timestamp = Date.now();
  const rawData = `${userId}:${timestamp}`;
  const signature = crypto.createHmac("sha256", SERVER_SECRET).update(rawData).digest("hex");
  return `${userId}:${timestamp}:${signature}`;
}

function verifySecureToken(token: string): string | null {
  if (!token) return null;
  const parts = token.split(":");
  if (parts.length !== 3) return null;
  const [userId, timestampStr, hmacSig] = parts;
  const timestamp = parseInt(timestampStr, 10);
  
  // Enforce session expiration of 24 Hours
  if (Date.now() - timestamp > 864 * 100000 || Date.now() - timestamp < -60000) {
    return null; // Token expired or future timestamp forgery
  }
  
  const rawData = `${userId}:${timestampStr}`;
  const expectedSignature = crypto.createHmac("sha256", SERVER_SECRET).update(rawData).digest("hex");
  if (hmacSig !== expectedSignature) {
    return null; // Signature verification failed (forged token)
  }
  return userId;
}

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

  // === SECURITY HEADERS MIDDLEWARE ===
  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-eval' 'unsafe-inline' https:; img-src 'self' data: https:; connect-src 'self' https: ws: wss:; font-src 'self' https: data:;");
    next();
  });

  // === RATELIMITING SLIDING BUCKET ENGINE ===
  interface RateLimitBucket {
    tokens: number;
    lastRefill: number;
  }
  const rateLimitCache = new Map<string, RateLimitBucket>();

  function createRateLimiter(limit: number, intervalMs: number, apiCategory: string) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
      const key = `${clientIp}:${apiCategory}`;
      const now = Date.now();

      let bucket = rateLimitCache.get(key);
      if (!bucket) {
        bucket = { tokens: limit, lastRefill: now };
        rateLimitCache.set(key, bucket);
      }

      // Refill tokens proportional to elapsed time
      const elapsed = now - bucket.lastRefill;
      const refillAmount = Math.floor(elapsed * (limit / intervalMs));
      if (refillAmount > 0) {
        bucket.tokens = Math.min(limit, bucket.tokens + refillAmount);
        bucket.lastRefill = now;
      }

      if (bucket.tokens <= 0) {
        console.warn(`[TENTATIVE DE DOS / ABUS API] IP bloquée par le Rate Limiter : ${clientIp} sur la catégorie: ${apiCategory}`);
        res.status(429).json({
          error: "Trop de requêtes",
          message: `Vous avez dépassé la bande passante autorisée pour ${apiCategory}. Veuillez attendre ${Math.ceil((intervalMs - elapsed) / 1000)} secondes.`,
          retryAfterMs: Math.max(1000, intervalMs - elapsed)
        });
        return;
      }

      bucket.tokens -= 1;
      next();
    };
  }

  // === SANITIZATION & PROMPT INJECTION FIREWALL ===
  function sanitizeAndValidateInputs(req: express.Request, res: express.Response, next: express.NextFunction) {
    const INJECTION_PATTERNS = [
      /ignore previous/i,
      /forget categories/i,
      /system instructions/i,
      /developer prompt/i,
      /bypass safety/i,
      /you are now a/i,
      /tu es maintenant/i,
      /override restrictions/i,
      /disable guidelines/i
    ];

    const body = req.body || {};
    for (const key in body) {
      if (typeof body[key] === "string") {
        const val = body[key].trim();
        
        // Enforce maximum body parameter length
        if (val.length > 2000) {
          res.status(400).json({
            error: "Validation échouée",
            message: `Le champ '${key}' dépasse la taille maximale autorisée de 2000 caractères.`
          });
          return;
        }

        // Validate injection signatures
        for (const pattern of INJECTION_PATTERNS) {
          if (pattern.test(val)) {
            console.error(`[ALERTE SECURITE PROMPT INJECTION] Tentative détectée et bloquée d'injection sur le champ '${key}' !`);
            res.status(400).json({
              error: "Protection Anti-Abus",
              message: "Votre requête contient des signatures syntaxiques non autorisées. La tentative d'altération de l'IA a été bloquée."
            });
            return;
          }
        }
      }
    }
    next();
  }

  // === SECURE AUTH MIDDLEWARE CONTROLLERS ===
  function authenticateToken(req: any, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      res.status(401).json({ error: "Non Authentifié", message: "Jeton de session absent de la requête." });
      return;
    }

    const userId = verifySecureToken(token);
    if (!userId) {
      res.status(403).json({ error: "Jeton Invalide", message: "Signature cryptographique du jeton obsolète ou corrompue." });
      return;
    }

    req.userId = userId;
    next();
  }

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

    socket.on("update-driver-location", ({ driverId, name, type, lat, lng }) => {
      db.deliveries[`driver-${driverId}`] = { lat, lng, status: "available" }; // Reusing deliveries storage structure for simplicity or adding new
      // Better yet, update a drivers_online map
      if (!db.trips["drivers_online"]) (db.trips as any)["drivers_online"] = {};
      (db.trips as any)["drivers_online"][driverId] = { name, type, lat, lng, lastUpdate: Date.now() };
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
  app.post("/api/register", sanitizeAndValidateInputs, createRateLimiter(15, 60000, "Authentification"), (req, res) => {
    const user = req.body;
    if (!user || !user.name || !user.email) {
      res.status(400).json({ error: "Validation échouée", message: "Le nom, l'email et l'identifiant sont requis." });
      return;
    }
    db.users.push(user);
    console.log("User registered on backend:", user.name);
    // Issue a cryptographically signed HMAC token for frontend storage
    const secureToken = generateSecureToken(user.id || "user_local_" + Math.random().toString(36).substr(2, 9));
    res.json({ success: true, user, token: secureToken });
  });

  app.post("/api/drivers/register", sanitizeAndValidateInputs, createRateLimiter(15, 60000, "Enregistrement Chauffeur"), (req, res) => {
    const driver = req.body;
    if (!driver || !driver.firstName || !driver.lastName || !driver.vehicleType) {
      res.status(400).json({ error: "Validation échouée", message: "Les informations de véhicule et d'identité sont requises." });
      return;
    }
    db.drivers.push(driver);
    console.log("Driver registered:", driver.firstName);
    const secureToken = generateSecureToken(driver.id || "dr_" + Math.random().toString(36).substr(2, 9));
    res.json({ success: true, driver, token: secureToken });
  });

  app.get("/api/drivers/nearby", createRateLimiter(60, 60000, "Géolocalisation"), (req, res) => {
    // Return registered drivers + some mock ones + real-time online drivers
    const mockDrivers = [
      { id: 'm1', name: 'Ousmane B.', type: 'TAXI', rating: 4.7, distance: 0.2, location: { lat: 0.395, lng: 9.455 }, currentDestination: 'Akanda' },
      { id: 'm2', name: 'Moussa K.', type: 'TAXI', rating: 4.8, distance: 0.4, location: { lat: 0.385, lng: 9.465 }, currentDestination: 'Nzeng-Ayong' },
    ];

    const onlineDrivers = [];
    const driversOnline = (db.trips as any)["drivers_online"] || {};
    for (const id in driversOnline) {
      const d = driversOnline[id];
      // Only show drivers updated in the last 2 minutes
      if (Date.now() - d.lastUpdate < 120000) {
        onlineDrivers.push({
          id,
          name: d.name,
          type: d.type,
          rating: 5.0,
          distance: 0.1, // Should be calculated
          location: { lat: d.lat, lng: d.lng },
          currentDestination: 'Libreville'
        });
      }
    }
    
    const registeredDrivers = db.drivers.map(d => ({
      id: d.id || Math.random().toString(36).substr(2, 9),
      name: `${d.firstName} ${d.lastName}`,
      type: d.vehicleType,
      rating: 5.0,
      distance: Math.random() * 0.5,
      location: { lat: 0.39 + (Math.random() - 0.5) * 0.01, lng: 9.45 + (Math.random() - 0.5) * 0.01 },
      currentDestination: 'Libreville'
    }));

    res.json([...onlineDrivers, ...registeredDrivers, ...mockDrivers]);
  });

  app.post("/api/merchants/register", sanitizeAndValidateInputs, createRateLimiter(15, 60000, "Enregistrement Marchand"), (req, res) => {
    const merchant = req.body;
    if (!merchant || !merchant.shopName || !merchant.ownerName) {
      res.status(400).json({ error: "Validation échouée", message: "Le nom de la boutique et du propriétaire sont indispensables." });
      return;
    }
    db.merchants.push(merchant);
    res.json({ success: true, merchant });
  });

  app.post("/api/artisans/register", sanitizeAndValidateInputs, createRateLimiter(15, 60000, "Enregistrement Artisan"), (req, res) => {
    const artisan = req.body;
    if (!artisan || !artisan.firstName || !artisan.lastName || !artisan.category) {
      res.status(400).json({ error: "Validation échouée", message: "Le nom et la spécialité d'artisanat sont indispensables." });
      return;
    }
    db.artisans.push(artisan);
    res.json({ success: true, artisan });
  });

  app.post("/api/pharmacies/register", sanitizeAndValidateInputs, createRateLimiter(15, 60000, "Enregistrement Pharmacie"), (req, res) => {
    const pharmacy = req.body;
    if (!pharmacy || !pharmacy.name || !pharmacy.neighborhood) {
      res.status(400).json({ error: "Validation échouée", message: "Le nom de l'officine et son quartier sont requis." });
      return;
    }
    db.pharmacies.push(pharmacy);
    res.json({ success: true, pharmacy });
  });

  app.post("/api/doctors/register", sanitizeAndValidateInputs, createRateLimiter(15, 60000, "Enregistrement Médecin"), (req, res) => {
    const doctor = req.body;
    if (!doctor || !doctor.firstName || !doctor.lastName || !doctor.category) {
      res.status(400).json({ error: "Validation échouée", message: "Le nom du médecin et sa catégorie médicale sont obligatoires." });
      return;
    }
    db.doctors.push(doctor);
    res.json({ success: true, doctor });
  });

  // AI Routes (Bound by anti-abus prompt firewalls & extreme query-limits)
  app.post("/api/ai/medical-orientation", sanitizeAndValidateInputs, createRateLimiter(10, 60000, "Orientation Médicale IA"), async (req, res) => {
    try {
      const { symptoms } = req.body;
      if (!symptoms || symptoms.length < 3) {
        res.status(400).json({ error: "Validation échouée", message: "Veuillez fournir une description de vos symptômes d'au moins 3 caractères." });
        return;
      }
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

  app.post("/api/ai/artisan-diagnosis", sanitizeAndValidateInputs, createRateLimiter(10, 60000, "Diagnostic Artisan IA"), async (req, res) => {
    try {
      const { problemDescription } = req.body;
      if (!problemDescription || problemDescription.length < 3) {
        res.status(400).json({ error: "Validation échouée", message: "Veuillez décrire votre problème en quelques mots." });
        return;
      }
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

  app.post("/api/ai/chat-response", sanitizeAndValidateInputs, createRateLimiter(20, 60000, "Assistance Chat IA"), async (req, res) => {
    try {
      const { name, message } = req.body;
      if (!name || !message) {
        res.status(400).json({ error: "Validation échouée", message: "Le nom du destinataire et le message sont obligatoires." });
        return;
      }
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

  app.post("/api/ai/neighborhood", sanitizeAndValidateInputs, createRateLimiter(30, 60000, "Détection Quartiers"), async (req, res) => {
    try {
      const { lat, lng } = req.body;
      if (typeof lat !== "number" || typeof lng !== "number") {
        res.status(400).json({ error: "Validation échouée", message: "Les coordonnées GPS de latitude et longitude doivent être valides." });
        return;
      }
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

  app.post("/api/ai/negotiate", sanitizeAndValidateInputs, createRateLimiter(15, 60000, "Négociation Tarifs IA"), async (req, res) => {
    try {
      const { currentPrice, offer, road, weather, passengers, hasLuggage } = req.body;
      if (typeof currentPrice !== "number" || typeof offer !== "number") {
        res.status(400).json({ error: "Validation échouée", message: "Les prix d'offre et de base doivent être saisis sous forme numérique." });
        return;
      }
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
