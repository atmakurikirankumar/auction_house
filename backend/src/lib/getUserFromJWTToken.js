import jwt from "jsonwebtoken";

const getUserFromJWTToken = async (token) => {
  const secret = process.env.JWT_SECRET;
  const decoded = jwt.verify(token.replace("Bearer ", ""), secret);
  return decoded;
};

export default getUserFromJWTToken;
