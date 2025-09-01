import jwt from "jsonwebtoken";

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

    // Verificamos que el token traiga los campos necesarios
    if (!decoded.id || !decoded.role) {
      return res
        .status(400)
        .json({ success: false, message: "Token inválido, faltan datos" });
    }

    req.user = decoded; // Aquí deben estar id, role, id_authorized_point
    next();
  } catch (error) {
    console.error("JWT error:", error);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
}
