import jwt from "jsonwebtoken";

export const generateToken = ({ id, role, name }) => {
  console.log("Generating token with payload:", { id, role, name });
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
  console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  const token = jwt.sign({ id, role, name }, process.env.JWT_SECRET, { expiresIn: "1d" });
  console.log("Generated token:", token.substring(0, 50) + "...");

  // Verify the token immediately to ensure it's valid
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verification successful:", decoded);
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }

  return token;
};
