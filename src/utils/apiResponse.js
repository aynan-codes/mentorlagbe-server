// Standard API Response Utility
const apiResponse = (
  res,
  statusCode = 200,
  message = "Request successful.",
  data = null
) => {
  const validStatusCode =
    Number.isInteger(statusCode) &&
    statusCode >= 100 &&
    statusCode <= 599
      ? statusCode
      : 500;

  return res.status(validStatusCode).json({
    success: validStatusCode >= 200 && validStatusCode < 300,
    message,
    ...(data !== null && data !== undefined ? { data } : {}),
  });
};

export default apiResponse;
