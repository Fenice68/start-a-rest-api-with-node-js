/**
 * Store in memoria per la gestione della risorsa "Articoli / Prodotti".
 * Fornisce operazioni CRUD complete con dati iniziali di esempio.
 */

let currentId = 1;

const sampleItems = [
  {
    id: 1,
    title: "Laptop UltraBook 15\"",
    description: "Portatile leggero con 16GB RAM e 512GB SSD per sviluppatori.",
    price: 999.99,
    category: "Informatica",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 2,
    title: "Mouse Wireless Ergonomico",
    description: "Mouse ottico con connessione Bluetooth e sensore ad alta precisione.",
    price: 39.50,
    category: "Accessori",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 3,
    title: "Tastiera Meccanica RGB",
    description: "Tastiera con switch tattili silenziosi e retroilluminazione personalizzabile.",
    price: 89.90,
    category: "Accessori",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 4,
    title: "Monitor 27\" 4K UHD",
    description: "Display IPS con calibrazione colori professionale e porta USB-C.",
    price: 349.00,
    category: "Informatica",
    createdAt: new Date().toISOString()
  }
];

let items = [...sampleItems];
currentId = 5;

export const itemsStore = {
  /**
   * Recupera tutti gli articoli con filtri opzionali
   */
  getAll({ search, category } = {}) {
    let result = [...items];

    if (category) {
      result = result.filter(
        item => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    return result;
  },

  /**
   * Recupera un articolo dato l'ID
   */
  getById(id) {
    const numericId = Number(id);
    return items.find(item => item.id === numericId) || null;
  },

  /**
   * Crea un nuovo articolo
   */
  create({ title, description = "", price, category = "Generale" }) {
    const newItem = {
      id: currentId++,
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    return newItem;
  },

  /**
   * Aggiorna un articolo esistente
   */
  update(id, { title, description, price, category }) {
    const numericId = Number(id);
    const index = items.findIndex(item => item.id === numericId);
    if (index === -1) return null;

    const existing = items[index];
    const updated = {
      ...existing,
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(category !== undefined && { category: category.trim() }),
      updatedAt: new Date().toISOString()
    };

    items[index] = updated;
    return updated;
  },

  /**
   * Rimuove un articolo dato l'ID
   */
  delete(id) {
    const numericId = Number(id);
    const index = items.findIndex(item => item.id === numericId);
    if (index === -1) return null;

    const [deleted] = items.splice(index, 1);
    return deleted;
  },

  /**
   * Ripristina i dati iniziali (utile per i test)
   */
  reset() {
    items = sampleItems.map(item => ({ ...item }));
    currentId = 5;
    return items;
  }
};
