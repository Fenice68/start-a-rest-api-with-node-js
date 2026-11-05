import { Router } from "express";
import { healthRouter } from "./health.js";
import { itemsRouter } from "./items.js";

export const apiRouter = Router();

// Informazioni di base sull'API
apiRouter.get("/", (req, res) => {
  res.json({
    message: "Benvenuto nella REST API Node.js!",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      items: "/api/items",
      itemById: "/api/items/:id"
    },
    documentation: "/ (interfaccia web interattiva)"
  });
});

apiRouter.use("/health", healthRouter);
apiRouter.use("/items", itemsRouter);
