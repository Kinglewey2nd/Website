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
    <div className="p-10 h-screen ">
      <button
        className="w-[250px] px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
        onClick={() => navigate(-1)}
      >
        Back to menu
      </button>
      <div className="card-creator-container flex jus gap-6 min-h-screen  text-white p-6">
        {/* Form Section */}
        <div className="form-section md:w-1/2 backdrop-brightness-50 border border-white p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-2xl font-bold mb-4">Create Card</h2>

          <form className="form-section space-y-4">
            <div>
              <label className="block mb-1 font-medium">Card Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "main")}
                className="block w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Rarity Gem Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "gem")}
                className="block w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Collection Name</label>
              <input
                name="collectionName"
                value={formData.collectionName}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-3 text-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Card Name</label>
              <input
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-3 text-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Creature Type</label>
              <input
                name="creatureType"
                value={formData.creatureType}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-3 text-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-3 text-white resize-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Health</label>
              <input
                name="health"
                value={formData.health}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-3 text-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Attack</label>
              <input
                name="attack"
                value={formData.attack}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-3 text-white"
              />
            </div>

            <button
              type="button"
              className="w-[150px] px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition"
              onClick={handleUpload}
            >
              Submit
            </button>
          </form>

          <p className="mt-4 text-green-400">{status}</p>
        </div>

        {/* Preview Section */}
        <div className="  md:w-1/2">
          <div className=" relative w-1/2 max-h-full left-40 bg-gray-800 border border-gray-700 rounded-xl p-6 text-white ">
            {preview ? (
              <img
                src={preview}
                alt="card-art"
                className="w-full h-48 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-48 bg-gray-700 flex items-center justify-center rounded-md text-gray-300">
                Image Upload
              </div>
            )}

            {gemPreview && (
              <img
                src={gemPreview}
                alt="rarity-gem"
                className="absolute top-4 right-4 w-10 h-10"
              />
            )}

            <div className="text-2xl max-w-full font-bold mt-4">
              {formData.cardName || "Card Name"}
            </div>
            <div className="italic text-gray-300">
              {formData.creatureType || "Creature Type"}
            </div>
            <div className="description text-sm overflow-hidden break-words">
              {formData.description || "Card Description"}
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-red-400">
                ❤️ {formData.health || "Health"}
              </span>
              <span className="text-blue-400">
                ⚔️ {formData.attack || "Attack"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreator;
