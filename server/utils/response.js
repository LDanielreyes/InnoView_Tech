// server/utils/response.js

// Success response
export function sendSuccess(res, data = null, message = "OK") {
  res.json({ success: true, message, data });
}

// Error response
export function sendError(res, message = "Server error", code = 500) {
  res.status(code).json({ success: false, message });
}
