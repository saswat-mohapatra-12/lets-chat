import auth from "../config/firebase-config.js";

export const VerifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
  } catch (e) {
    return res.status(401).json({ message: "Internal Error" });
  }
};

export const VerifySocketToken = async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Unauthorized: Token missing"));
  }

  try {
    const decodeValue = await auth.verifyIdToken(token);

    if (decodeValue) {
      socket.user = decodeValue;

      return next();
    }
  } catch (e) {
    return next(new Error("Internal Error"));
  }
};
