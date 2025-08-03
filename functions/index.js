const functions = require("firebase-functions");
const { getStorage } = require("firebase-admin/storage");
const admin = require("firebase-admin");

admin.initializeApp();

// Signed upload URL HTTP function
exports.getSignedUploadUrl = functions.https.onRequest(async (req, res) => {
  // CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const { fileName, contentType } = req.body;

    if (!fileName || !contentType) {
      return res.status(400).json({ error: "Missing fileName or contentType" });
    }

    const bucket = getStorage().bucket("spellgrave-f2e30");
    const file = bucket.file(`cards/${fileName}`);

    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    });

    console.log("✅ Generated signed URL:", url);
    res.status(200).json({ url });
  } catch (error) {
    console.error("🔥 Error generating signed URL:", error);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
});

// Callable function for deleting card images securely
exports.deleteCardImage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in."
    );
  }

  const { fileName } = data;
  if (!fileName) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "File name is required."
    );
  }

  const bucket = admin.storage().bucket();

  try {
    await bucket.file(`cards/${fileName}`).delete();
    console.log(`✅ Deleted file: cards/${fileName}`);
    return { success: true };
  } catch (error) {
    console.error("🔥 Error deleting file:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to delete file."
    );
  }
});
