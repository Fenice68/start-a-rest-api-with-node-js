import { Router } from "express";

export const healthRouter = Router();

const startedAt = new Date();

// GET /api/health
healthRouter.get("/", (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startedAt.getTime()) / 1000);

  res.json({
    status: "ok",
    service: "Node.js REST API",
    uptime: `${uptimeSeconds}s`,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  });
});
