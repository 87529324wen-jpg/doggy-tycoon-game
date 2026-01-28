import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase } from "./db";
import apiRouter from "./api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS for development
  if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      if (req.method === "OPTIONS") {
        return res.sendStatus(200);
      }
      next();
    });
  }

  // Initialize database
  try {
    await initDatabase();
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    // Continue without database in development
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }

  // API routes
  app.use(apiRouter);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
