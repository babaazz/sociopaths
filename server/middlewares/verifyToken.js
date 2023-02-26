import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (!authHeader?.startsWith("Bearer "))
      res.status(403).send("Access Denied");

    const accessToken = authHeader.split(" ")[1];

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) res.status(403).send("Access Denied");
      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
