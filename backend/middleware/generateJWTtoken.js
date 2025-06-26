import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;



const generateJWTtoken = async (user_id, email) => {
  return jwt.sign(
    { user_id: user_id, user_email: email },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

export default generateJWTtoken
