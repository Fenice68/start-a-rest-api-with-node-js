process.env.NODE_ENV = "test";

import test, { describe, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";
import { itemsStore } from "../src/data/itemsStore.js";

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

beforeEach(() => {
  itemsStore.reset();
});

describe("REST API - Endpoint di Sistema", () => {
  test("GET /api/health restituisce 200 e stato ok", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(data.uptime);
    assert.ok(data.timestamp);
    assert.ok(data.nodeVersion);
  });

  test("GET /api restituisce informazioni e lista endpoint", async () => {
    const res = await fetch(`${baseUrl}/api`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.version, "1.0.0");
    assert.ok(data.endpoints);
  });

  test("GET /rotta-inesistente restituisce 404 in formato JSON", async () => {
    const res = await fetch(`${baseUrl}/api/non-esisto`);
    assert.equal(res.status, 404);

    const data = await res.json();
    assert.equal(data.success, false);
    assert.ok(data.error);
  });
});

describe("REST API - Operazioni CRUD su /api/items", () => {
  test("GET /api/items restituisce la lista predefinita degli articoli", async () => {
    const res = await fetch(`${baseUrl}/api/items`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.count, 4);
    assert.ok(Array.isArray(body.data));
  });

  test("GET /api/items?search=mouse filtra correttamente i risultati", async () => {
    const res = await fetch(`${baseUrl}/api/items?search=mouse`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.count, 1);
    assert.match(body.data[0].title, /mouse/i);
  });

  test("GET /api/items/:id restituisce l'articolo corretto", async () => {
    const res = await fetch(`${baseUrl}/api/items/1`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.id, 1);
  });

  test("GET /api/items/:id con ID inesistente restituisce 404", async () => {
    const res = await fetch(`${baseUrl}/api/items/9999`);
    assert.equal(res.status, 404);

    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.error, /non trovato/i);
  });

  test("POST /api/items crea un nuovo articolo valido con status 201", async () => {
    const newItem = {
      title: "Microfono USB da Studio",
      description: "Microfono a condensatore per podcast e streaming",
      price: 119.50,
      category: "Audio"
    };

    const res = await fetch(`${baseUrl}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.title, newItem.title);
    assert.equal(body.data.price, newItem.price);
    assert.ok(body.data.id);
  });

  test("POST /api/items con dati non validi (manca title) restituisce 400", async () => {
    const res = await fetch(`${baseUrl}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: 29.99 })
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.error, /title/i);
  });

  test("POST /api/items con prezzo negativo restituisce 400", async () => {
    const res = await fetch(`${baseUrl}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", price: -10 })
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.error, /price/i);
  });

  test("PUT /api/items/:id aggiorna l'articolo con successo", async () => {
    const res = await fetch(`${baseUrl}/api/items/2`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: 45.00, title: "Mouse Wireless Ergonomico V2" })
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.price, 45.00);
    assert.equal(body.data.title, "Mouse Wireless Ergonomico V2");
  });

  test("DELETE /api/items/:id elimina l'articolo e le successive GET restituiscono 404", async () => {
    const deleteRes = await fetch(`${baseUrl}/api/items/3`, {
      method: "DELETE"
    });
    assert.equal(deleteRes.status, 200);

    const getRes = await fetch(`${baseUrl}/api/items/3`);
    assert.equal(getRes.status, 404);
  });
});
