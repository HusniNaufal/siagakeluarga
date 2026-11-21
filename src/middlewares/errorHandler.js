export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} tidak ditemukan` });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Body JSON tidak valid
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Format JSON tidak valid' });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Terjadi kesalahan pada server' : err.message,
  });
};

export default errorHandler;
