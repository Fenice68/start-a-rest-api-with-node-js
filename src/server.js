import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server REST API in ascolto su http://localhost:${PORT}`);
  console.log(`📋 Documentazione & Dashboard Web: http://localhost:${PORT}/`);
  console.log(`🔍 Endpoint di verifica: http://localhost:${PORT}/api/health`);
  console.log(`📦 Endpoint risorse: http://localhost:${PORT}/api/items`);
});

// Chiusura pulita in caso di terminazione
process.on("SIGINT", () => {
  console.log("\nArresto del server in corso...");
  server.close(() => {
    console.log("Server arrestato con successo.");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  server.close(() => {
    process.exit(0);
  });
});
