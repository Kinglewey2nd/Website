import React, { useState } from "react";
import { useAuth } from "../useAuth";
import { useNavigate } from "react-router-dom";
import "./CardCreator.css";

const CardCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [gemFile, setGemFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [gemPreview, setGemPreview] = useState("");
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    collectionName: "",
    cardName: "",
    creatureType: "",
    description: "",
    health: "",
    attack: "",
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "gem"
  ) => {
    const selected = e.target.files?.[0] || null;
    if (type === "main") {
      setFile(selected);
      if (selected) setPreview(URL.createObjectURL(selected));
    } else {
      setGemFile(selected);
      if (selected) setGemPreview(URL.createObjectURL(selected));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    try {
      setStatus("⏳ Requesting signed upload URL...");
      const res = await fetch(
        "https://us-central1-spellgrave-f2e30.cloudfunctions.net/getSignedUploadUrl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: `${Date.now()}_${file.name.replace(/[^\w.-]/g, "_")}`,
            contentType: file.type,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      console.log("✅ Got signed URL:", data.url);
      setStatus("⬆️ Uploading to signed URL...");

      const uploadRes = await fetch(data.url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(
          `Upload failed. Status: ${uploadRes.status} – ${errorText}`
        );
      }

      setStatus("✅ Upload successful! Image is now in Firebase Storage.");
      console.log("✅ Upload complete:", data.url);
    } catch (err: any) {
      console.error("❌ Upload error:", err);
      setStatus(`❌ Upload failed: ${err.message || err}`);
    }
  };

  return (
    <div className="card-creator-container">
      <div className="form-section">
        <button type="button" style={{ width: "250px" }} onClick={handleUpload}>
            Back to menu
          </button>
        <h2>Create Card</h2>
        <form className="form-section">
          <div>
            <label>Card Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "main")}
            />
            {preview && <img src={preview} alt="preview" style={{ width: 150 }} />}
          </div>

          <div>
            <label>Rarity Gem Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "gem")}
            />
            {gemPreview && <img src={gemPreview} alt="gem-preview" style={{ width: 50 }} />}
          </div>

          <div>
            <label>Collection Name</label>
            <input
              name="collectionName"
              value={formData.collectionName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Card Name</label>
            <input
              name="cardName"
              value={formData.cardName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Creature Type</label>
            <input
              name="creatureType"
              value={formData.creatureType}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Health</label>
            <input
              name="health"
              value={formData.health}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Attack</label>
            <input
              name="attack"
              value={formData.attack}
              onChange={handleInputChange}
            />
          </div>

          <button type="button" style={{ width: "150px" }} onClick={handleUpload}>
            Submit
          </button>
        </form>
        <p>{status}</p>
      </div>

      <div className="preview-section">
        <div className="card-preview">
          {preview ? (
            <img src={preview} alt="card-art" className="card-art" />
          ) : (
            <div className="card-art" style={{ backgroundColor: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Image Upload
            </div>
          )}

          {gemPreview && (
            <img src={gemPreview} alt="rarity-gem" className="gem-icon" />
          )}

          <div className="card-title">
            {formData.cardName || "Card Name"}
          </div>

          <div className="card-type">
            {formData.creatureType || "Creature Type"}
          </div>

          <div className="card-desc">
            {formData.description || "Card Description"}
          </div>

          <div className="card-health">
            {formData.health || "Health"}
          </div>

          <div className="card-attack">
            {formData.attack || "Attack"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreator;
