import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase"; // Make sure this exports `db = getFirestore(app)`
import { useAuth } from "@/useAuth";

const CreateCollection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [gemFile, setGemFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [gemPreview, setGemPreview] = useState("");
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    collectionName: "",
    FlavorText: "",
    NormalFrame: "",
    FoilVersionFrame: "",
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "NormalFrame" | "FoilVersionFrame"
  ) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) return;

    if (type === "NormalFrame") {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    } else {
      setGemFile(selected);
      setGemPreview(URL.createObjectURL(selected));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setStatus("⚠️ You must be signed in to create a collection.");
      return;
    }

    if (!formData.collectionName || !formData.FlavorText || !file || !gemFile) {
      setStatus("⚠️ All fields and images are required.");
      return;
    }

    try {
      await addDoc(collection(db, "collections"), {
        collectionName: formData.collectionName,
        flavorText: formData.FlavorText,
        normalFrame: file.name,
        foilVersionFrame: gemFile.name,
        ownerId: user.uid,
        createdAt: new Date(),
      });

      setStatus(" Collection created successfully!");
      setFormData({
        collectionName: "",
        FlavorText: "",
        NormalFrame: "",
        FoilVersionFrame: "",
      });
      setFile(null);
      setGemFile(null);
      setPreview("");
      setGemPreview("");
    } catch (err) {
      console.error(" Firestore save error:", err);
      setStatus(" Failed to save collection. Try again.");
    }
  };

  return (
    <div className="p-10  h-screen">
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
            Create Collection
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold text-gray-100 mb-1">
                Normal Frame
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFileChange(e, "NormalFrame")}
                className="block w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
              />
              {preview && (
                <img src={preview} alt="NormalFrame" style={{ width: 150 }} />
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-100 mb-1">
                Foil Version Frame
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFileChange(e, "FoilVersionFrame")}
                className="block w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500"
              />
              {gemPreview && (
                <img
                  src={gemPreview}
                  alt="FoilVersionFrame"
                  style={{ width: 150 }}
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-100 mb-1">
                Collection Name
              </label>
              <input
                name="collectionName"
                required
                value={formData.collectionName}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-3 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-100 mb-1">
                Flavor Text
              </label>
              <input
                name="FlavorText"
                required
                value={formData.FlavorText}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-3 text-white"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-500"
            >
              Submit
            </button>
          </form>

          <p className="mt-4 text-green-500 font-medium">{status}</p>
        </div>
      </div>
    </div>
  );
};

export default CreateCollection;
