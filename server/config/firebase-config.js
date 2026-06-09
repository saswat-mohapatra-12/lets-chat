import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") });

let auth;

const hasFirebaseCreds =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

if (hasFirebaseCreds) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };

  const app = initializeApp({
    credential: cert(serviceAccount),
  });

  auth = getAuth(app);
} else {
  console.warn("WARNING: Firebase credentials are not fully configured in environment variables. Running with mock authentication.");
  auth = {
    verifyIdToken: async (token) => {
      console.log("Mock verifyIdToken called with token:", token);
      if (token === "mock-admin-token") {
        return { uid: "mock-admin-uid", email: "admin@example.com", name: "Mock Admin" };
      }
      throw new Error("Invalid token in mock mode");
    }
  };
}

export default auth;
