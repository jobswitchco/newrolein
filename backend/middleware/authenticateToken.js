import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;


const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers["authorization"];
//   console.log("🔵 Received Token:", token);

  if (!token) {
      console.log("⚠️ No token provided");
      return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
          console.error("❌ Token verification failed:", err);
          return res.status(403).json({ message: "Forbidden" });
      }
    //   console.log("✅ Token Verified:", user);
      req.user = user;
      next();
  });
};


export default authenticateToken
