import jwt, { JwtPayload } from "jsonwebtoken";
export function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
