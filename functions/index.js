const functions = require("firebase-functions");
const { getStorage } = require("firebase-admin/storage");
const admin = require("firebase-admin");

admin.initializeApp();

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

    // Use the correct bucket name here
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
