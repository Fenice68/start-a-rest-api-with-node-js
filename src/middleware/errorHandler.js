/**
 * Middleware centralizzato per la gestione degli errori.
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  console.error(`[Errore] ${req.method} ${req.originalUrl} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    error: err.message || "Errore interno del server",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}
