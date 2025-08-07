import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRarityGem = () => {
  const navigate = useNavigate();
  const [gemFile, setGemFile] = useState<File | null>(null);
  const [gemPreview, setGemPreview] = useState<string>("");
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    GemName: "",
    gemImage: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      setGemFile(selected);
      setGemPreview(URL.createObjectURL(selected)); // Generate preview URL
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

            <form className="space-y-4">
              {/* Gem Image */}
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

              {/* Text Inputs */}
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
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  setStatus("Collection created successfully!");
                  setFormData({
                    GemName: "",
                    gemImage: ""
                  });
                  setGemFile(null);
                  setGemPreview("");
                }}
              >
                Submit
              </button>
            </form>

            <p className="mt-4 text-green-600 font-medium">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRarityGem;