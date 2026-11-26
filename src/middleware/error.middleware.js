// Global Error Handling Middleware
const errorMiddleware = (err, req, res, next) => {
  console.error("Server Error:", err);

  const statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode <= 599
      ? err.statusCode
      : 500;

  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error."
      : err.message || "Something went wrong.";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;