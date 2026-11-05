/**
 * Middleware per gestire rotte inesistenti (404 Not Found)
 */
export function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    error: "Risorsa non trovata",
    path: req.originalUrl,
    method: req.method
  });
}
