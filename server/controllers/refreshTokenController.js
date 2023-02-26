import User from "../models/User.js";
import jwt from "jsonwebtoken";

const handleRefresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res.status(401).json({ message: "Refresh Token doesn't exist" });

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.status(403).json({ message: "Forbidden" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        const foundUserId = foundUser._id.valueOf();
        console.log(foundUserId);
        console.log(decoded.id);
        if (err || foundUserId !== decoded.id)
          return res.status(403).json({ message: "forbidden" });
        const accessToken = jwt.sign(
          { id: foundUser._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "700s" }
        );
        res.status(201).json({ accessToken });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default handleRefresh;
