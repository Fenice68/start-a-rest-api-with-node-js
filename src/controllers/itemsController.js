import { itemsStore } from "../data/itemsStore.js";

/**
 * Controller per la gestione delle operazioni CRUD sugli articoli
 */

// GET /api/items
export function getItems(req, res) {
  const { search, category } = req.query;
  const items = itemsStore.getAll({ search, category });

  res.json({
    success: true,
    count: items.length,
    data: items
  });
}

// GET /api/items/:id
export function getItemById(req, res) {
  const { id } = req.params;
  const item = itemsStore.getById(id);

  if (!item) {
    return res.status(404).json({
      success: false,
      error: `Articolo con ID ${id} non trovato`
    });
  }

  res.json({
    success: true,
    data: item
  });
}

// POST /api/items
export function createItem(req, res) {
  const { title, description, price, category } = req.body;

  // Validazione di base
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      error: "Il campo 'title' è obbligatorio e deve essere una stringa non vuota"
    });
  }

  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({
      success: false,
      error: "Il campo 'price' è obbligatorio e deve essere un numero valido maggiore o uguale a 0"
    });
  }

  const newItem = itemsStore.create({
    title,
    description,
    price,
    category
  });

  res.status(201).json({
    success: true,
    message: "Articolo creato con successo",
    data: newItem
  });
}

// PUT /api/items/:id
export function updateItem(req, res) {
  const { id } = req.params;
  const existing = itemsStore.getById(id);

  if (!existing) {
    return res.status(404).json({
      success: false,
      error: `Articolo con ID ${id} non trovato`
    });
  }

  const { title, description, price, category } = req.body;

  if (title !== undefined && (!title || typeof title !== "string" || !title.trim())) {
    return res.status(400).json({
      success: false,
      error: "Se fornito, il campo 'title' deve essere una stringa non vuota"
    });
  }

  if (price !== undefined && (isNaN(Number(price)) || Number(price) < 0)) {
    return res.status(400).json({
      success: false,
      error: "Se fornito, il campo 'price' deve essere un numero valido maggiore o uguale a 0"
    });
  }

  const updated = itemsStore.update(id, {
    title,
    description,
    price,
    category
  });

  res.json({
    success: true,
    message: "Articolo aggiornato con successo",
    data: updated
  });
}

// DELETE /api/items/:id
export function deleteItem(req, res) {
  const { id } = req.params;
  const deleted = itemsStore.delete(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: `Articolo con ID ${id} non trovato`
    });
  }

  res.json({
    success: true,
    message: "Articolo eliminato con successo",
    data: deleted
  });
}
