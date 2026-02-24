
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

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

  app.use(express.json());

  // In-memory "Database"
  const db = {
    users: [] as any[],
    drivers: [] as any[],
    merchants: [] as any[],
    artisans: [] as any[],
    pharmacies: [] as any[],
    orders: [] as any[],
    deliveries: {} as Record<string, { lat: number, lng: number, status: string }>
  };

  // Socket.io Logic
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

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
