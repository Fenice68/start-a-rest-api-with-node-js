import { Router } from "express";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from "../controllers/itemsController.js";

export const itemsRouter = Router();

// Elenco e creazione
itemsRouter.get("/", getItems);
itemsRouter.post("/", createItem);

// Operazioni su singolo articolo
itemsRouter.get("/:id", getItemById);
itemsRouter.put("/:id", updateItem);
itemsRouter.delete("/:id", deleteItem);
