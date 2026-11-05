# Start a REST API with Node.js ⚡

Progetto starter professionale, modulare e completo per sviluppare e collaudare una **REST API** con **Node.js** ed **Express**.

Include una gestione architetturale a livelli (Router, Controller, Data Store, Middleware), validazione delle richieste, gestione degli errori con formattazione JSON uniforme, suite di test automatizzati nativi (`node --test`) e una **dashboard web interattiva** per testare ogni endpoint direttamente dal browser.

---

## 🚀 Funzionalità Principali

- **Architettura Modulare**: Separazione chiara tra routing (`src/routes`), logica di business (`src/controllers`), storage (`src/data`) e middleware (`src/middleware`).
- **Standard Moderno ECMAScript (ESM)**: Uso nativo di `import` / `export`.
- **Operazioni CRUD Complete**: Implementate per la risorsa `/api/items` (elenco con ricerca, dettaglio, creazione con validazione, aggiornamento e cancellazione).
- **Health Check**: Endpoint `/api/health` per il monitoraggio dello stato e uptime del server.
- **Gestione Errori Centralizzata**: Risposte 400 (Bad Request), 404 (Not Found) e 500 (Internal Server Error) sempre in formato JSON coerente.
- **Interfaccia Web di Collaudo**: Dashboard accessibile alla radice `/` per eseguire chiamate in tempo reale e visualizzare i JSON ricevuti.
- **Zero dipendenze di test esterne**: Utilizza il nuovo test runner integrato di Node.js (`node --test` e `node:assert`).

---

## 📁 Struttura del Progetto

```
.
├── public/                     # Frontend statico (Dashboard interattiva)
│   ├── index.html              # Interfaccia grafica
│   ├── style.css               # Stili moderni e responsive
│   └── app.js                  # Client JavaScript per chiamate fetch
├── src/
│   ├── app.js                  # Configurazione Express e middleware globali
│   ├── server.js               # Entry point per avvio server HTTP
│   ├── controllers/
│   │   └── itemsController.js  # Logica di business per le operazioni CRUD
│   ├── data/
│   │   └── itemsStore.js       # Store dati in-memory con dati di esempio
│   ├── middleware/
│   │   ├── errorHandler.js     # Gestore centralizzato errori HTTP
│   │   └── notFound.js         # Risposta 404 per rotte non registrate
│   └── routes/
│       ├── api.js              # Router principale montato su /api
│       ├── health.js           # Endpoint di stato e diagnostica
│       └── items.js            # Rotte dedicate agli articoli
├── tests/
│   └── api.test.js             # Test automatizzati con Node.js Test Runner
├── package.json
└── README.md
```

---

## 🛠️ Requisiti e Installazione

- **Node.js**: v18.0.0 o superiore (testato su Node v22)
- **npm**: v9.0.0 o superiore

Clona il repository ed installa le dipendenze:

```bash
npm install
```

---

## 💻 Come Avviare l'Applicazione

### Avvio Standard
```bash
npm start
```
Il server sarà attivo su `http://localhost:3000`.

### Modalità Sviluppo (con auto-reload)
```bash
npm run dev
```

### Esecuzione dei Test Automatizzati
```bash
npm test
```

---

## 📡 Riferimento Endpoint REST API

Tutti gli endpoint rispondono con intestazione `Content-Type: application/json`.

| Metodo | Endpoint | Descrizione | Parametri / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Controllo salute del server | Nessuno |
| `GET` | `/api/items` | Elenco di tutti gli articoli | Query: `?search=...` o `?category=...` |
| `GET` | `/api/items/:id` | Dettaglio di un singolo articolo | Parametro `:id` nell'URL |
| `POST` | `/api/items` | Creazione di un nuovo articolo | JSON: `{ title, price, category?, description? }` |
| `PUT` | `/api/items/:id` | Aggiornamento di un articolo | Parametro `:id` + JSON con i campi da aggiornare |
| `DELETE` | `/api/items/:id` | Cancellazione di un articolo | Parametro `:id` nell'URL |

---

## 🧪 Esempi con cURL

### 1. Controllo Stato (Health Check)
```bash
curl -X GET http://localhost:3000/api/health
```

### 2. Recupero Articoli
```bash
curl -X GET http://localhost:3000/api/items
```

### 3. Ricerca per parola chiave
```bash
curl -X GET "http://localhost:3000/api/items?search=laptop"
```

### 4. Creazione nuovo Articolo
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Webcam Full HD 1080p",
    "price": 49.90,
    "category": "Accessori",
    "description": "Webcam con microfono integrato per videochiamate"
  }'
```

### 5. Modifica Articolo
```bash
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 899.99
  }'
```

### 6. Eliminazione Articolo
```bash
curl -X DELETE http://localhost:3000/api/items/2
```

---

## 🌐 Anteprima Web

Puoi visualizzare e testare l'interfaccia interattiva del progetto all'indirizzo del deploy o aprendo `http://localhost:3000/` nel tuo browser.
