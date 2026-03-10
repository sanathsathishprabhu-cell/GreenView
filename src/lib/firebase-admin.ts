import * as admin from "firebase-admin";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

// Only initialise when real credentials are present (not placeholders)
const hasValidCreds =
  projectId &&
  clientEmail &&
  privateKeyRaw &&
  !privateKeyRaw.includes("YOUR_") &&
  privateKeyRaw.startsWith("-----BEGIN");

if (!admin.apps.length && hasValidCreds) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKeyRaw!.replace(/\\n/g, "\n"),
      }),
    });
  } catch (err) {
    console.error("[firebase-admin] init failed:", err);
  }
}

// Lazy getters — throw at call-time (not build-time) when not configured
function getAdminApp() {
  if (!admin.apps.length) {
    throw new Error(
      "Firebase Admin is not initialised. Please add your service account credentials to .env.local"
    );
  }
  return admin.app();
}

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(_t, prop) {
    return (admin.firestore(getAdminApp()) as unknown as Record<string, unknown>)[prop as string];
  },
});

export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(_t, prop) {
    return (admin.auth(getAdminApp()) as unknown as Record<string, unknown>)[prop as string];
  },
});

export const adminStorage = new Proxy({} as admin.storage.Storage, {
  get(_t, prop) {
    return (admin.storage(getAdminApp()) as unknown as Record<string, unknown>)[prop as string];
  },
});

export default admin;
