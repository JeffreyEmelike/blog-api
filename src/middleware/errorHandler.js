export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const isOperational = err.status !== undefined;

  const body = {
    error: isOperational ? err.message : "Internal server error",
  };
  if (err.details) {
    body.details = err.details;
  }

  res.status(status).json(body);
}
