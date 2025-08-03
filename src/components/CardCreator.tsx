import React, { useState } from "react";
import { useAuth } from "../useAuth";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { app } from "../firebase";

const CardCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [cardName, setCardName] = useState("");
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState("");

  const db = getFirestore(app);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
      console.log("📸 Selected file:", selected.name);
      console.log("🧾 File type:", selected.type);
      console.log("📦 File size:", selected.size);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      setStatus("❌ Must be logged in to upload.");
      return;
    }
    if (!file) {
      setStatus("❌ No file selected.");
      return;
    }
    if (!cardName.trim()) {
      setStatus("❌ Please enter a card name.");
      return;
    }

    try {
      setStatus("⏳ Requesting signed upload URL...");

      // Make filename safe once
      const safeFileName = `${Date.now()}_${file.name.replace(/[^\w.-]/g, "_")}`;

      // Request signed upload URL from your Cloud Function
      const res = await fetch(
        "https://us-central1-spellgrave-f2e30.cloudfunctions.net/getSignedUploadUrl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: safeFileName,
            contentType: file.type,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      console.log("✅ Got signed URL:", data.url);
      setStatus("⬆️ Uploading to signed URL...");

      // Upload file using PUT to the signed URL
      const uploadRes = await fetch(data.url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(`Upload failed. Status: ${uploadRes.status} – ${errorText}`);
      }

      // Extract the public URL (strip query params)
      const cleanUrl = data.url.split("?")[0];

      // Save metadata and clean URL in Firestore
      await addDoc(collection(db, "cards"), {
        fileName: safeFileName,
        imageUrl: cleanUrl,
        cardName: cardName.trim(),
        createdAt: Timestamp.now(),
        ownerId: user.uid,
      });

      setStatus("✅ Upload successful! Image and name saved.");
      setCardName("");
      setFile(null);
      setPreview("");
      console.log("✅ Upload complete:", cleanUrl);
    } catch (err: any) {
      console.error("❌ Upload error:", err);
      setStatus(`❌ Upload failed: ${err.message || err}`);
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>🧪 Card Image Upload</h2>
      <input
        type="text"
        placeholder="Enter card name"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />
      <input type="file" accept="image/*" onChange={handleSelect} />
      <br />
      <br />
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ width: 200, border: "1px solid white" }}
        />
      )}
      <br />
      <br />
      <button onClick={handleUpload} disabled={!file || !cardName.trim()}>
        Upload Image
      </button>
      <p>{status}</p>
      <button onClick={() => navigate("/menu")} style={{ marginTop: "1rem" }}>
        Back to Menu
      </button>
    </div>
  );
};

export default CardCreator;
