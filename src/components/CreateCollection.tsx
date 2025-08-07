import { useAuth } from '@/useAuth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {db} from '@/firebase'

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
    NormalFrame:"",
    FoilVersionFrame:""
  });

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "NormalFrame" | "FoilVersionFrame"
      ) => {
        const selected = e.target.files?.[0] || null;
        if (type === "NormalFrame") {
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

    
  return (
    <div className='p-10 overflow-hidden h-screen'>
         <button
        type="button"
        className="mb-4 w-[250px] px-4 py-2 bg-gray-100 text-white rounded-md hover:bg-gray-700 transition"
        onClick={()=> navigate(-1)}
      >
        Back to menu
      </button>
        <div className="flex items-center justify-center">
    {/* Form Section */}
    <div className="md:w-[40%] border border-amber-50 backdrop-brightness-50 rounded-2xl shadow-xl p-6">
     
  
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Create Collection</h2>
  
      <form className="space-y-4">
        {/* Card Image */}
        <div>
          <label className="block font-semibold text-gray-100 mb-1">Normal Frame</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => handleFileChange(e, 'NormalFrame')}
            className="block w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
          />
           {preview && <img src={preview} alt="NormalFrame" style={{ width: 150 }} />}
          
        </div>
  
        {/* Gem Image */}
        <div>
          <label className="block font-semibold text-gray-100 mb-1">FoilVersion Frame</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => handleFileChange(e, 'FoilVersionFrame')}
            className="block w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500"
          />
           {gemPreview && <img src={gemPreview} alt="FoilVersionFrame" style={{ width: 150 }} />}
          
        </div>
  
        {/* Text Inputs */}
        {[
            ['Collection Name', 'collectionName'],
            ['Flavor Text', 'FlavorText'],
        ].map(([labelText, name]) => (
            <div key={name}>
                <label className="block font-semibold text-gray-100 mb-1">{labelText}</label>
                <input
                    name={name}
                    required
                    value={formData[name as keyof typeof formData]} // Type assertion added here
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-200 rounded-xl px-3 py-3 text-white resize-none"
                />
            </div>
        ))}
  
        {/* Description */}
        
  
        <button
          type="submit"
          className=""
            onClick={() => {
                // Handle form submission logic here
                setStatus("Collection created successfully!");
                // Reset form after submission
                setFormData({
                collectionName: '',
                FlavorText: '',
                NormalFrame: '',
                FoilVersionFrame: ''
                });
                setFile(null);
                setGemFile(null);
                setPreview("");
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
  )
}

export default CreateCollection
