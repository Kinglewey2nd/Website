import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // only Firestore
import { collection, addDoc, Timestamp } from "firebase/firestore";

const CreateRarityGem = () => {
  const navigate = useNavigate();
  const [gemFile, setGemFile] = useState<File | null>(null);
  const [gemPreview, setGemPreview] = useState<string>("");
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    GemName: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      setGemFile(selected);
      setGemPreview(URL.createObjectURL(selected));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.GemName || !gemFile) {
      setStatus("Please provide both Gem Name and Image.");
      return;
    }

    try {
      const fileName = gemFile.name;

      await addDoc(collection(db, "rarityGems"), {
        gemName: formData.GemName,
        fileName: fileName,
        createdAt: Timestamp.now(),
      });

      setStatus(" Rarity gem saved with file name only!");
      setFormData({ GemName: "" });
      setGemFile(null);
      setGemPreview("");
    } catch (err: any) {
      console.error(err);
      setStatus("Save failed: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div>
      <div className="p-10 overflow-hidden h-screen">
        <button
          type="button"
          className="mb-4 w-[250px] px-4 py-2 bg-gray-100 text-white rounded-md hover:bg-gray-700 transition"
          onClick={() => navigate(-1)}
        >
          Back to menu
        </button>
        <div className="flex items-center justify-center">
          <div className="md:w-[40%] border border-amber-50 backdrop-brightness-50 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">
              Create Rarity Gem
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block font-semibold text-gray-100 mb-1">
                  Gem image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="block w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                />
                {gemPreview && (
                  <img
                    src={gemPreview}
                    alt="Gem Preview"
                    style={{ width: 150 }}
                  />
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-100 mb-1">
                  Gem Name
                </label>
                <input
                  name="GemName"
                  required
                  value={formData.GemName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-3 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-500"
              >
                Submit
              </button>
            </form>

            <p className="mt-4 text-green-400 font-medium">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRarityGem;
