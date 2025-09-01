import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token in incoming requests.
 * Expects the Authorization header in the format: "Bearer <token>".
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expect: "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the decoded token contains the required fields
    if (!decoded.id || !decoded.role) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token, missing data" });
    }

    // Attach decoded user data to the request (id, role, id_authorized_point)
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT error:", error);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
}
