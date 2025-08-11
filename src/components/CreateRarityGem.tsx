import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import {  ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase';

type FormValues = {
  GemName: string;
  GemImage: FileList;
};

const CreateRarityGem = () => {
  const navigate = useNavigate();
  const [gemPreview, setGemPreview] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  // Watch file input for preview
  const gemFile = watch('GemImage');
  useEffect(() => {
    if (gemFile && gemFile.length > 0) {
      setGemPreview(URL.createObjectURL(gemFile[0]));
    } else {
      setGemPreview('');
    }
  }, [gemFile]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setStatus('');

      const file = data.GemImage[0];
      const fileName = `${Date.now()}_${file.name}`;
      if (!file) {
        setStatus('Please upload a gem image.');
        return;
      }

      const storageRef = ref(storage, `rarityGems/${fileName}`);
    await uploadBytes(storageRef, file);


    const publicUrl = await getDownloadURL(storageRef);
      
    console.log('Uploaded file URL:', publicUrl);

      // Step 4 — Save gem data in Firestore
      await addDoc(collection(db, 'rarityGems'), {
        gemName: data.GemName,
        gemImageUrl: publicUrl,
        createdAt: Timestamp.now(),
      });

      setStatus('Rarity gem created successfully!');
      reset();
      setGemPreview('');
    } catch (err: any) {
      console.error(err);
      setStatus('failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black ">
        <div className="text-center p-8 bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen ">

      <div className="flex items-center justify-center mt-40">
        <div className="md:w-[420px] w-full bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">
            Create Rarity Type
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Gem Name */}
            <div>
              <label className="block font-semibold text-gray-200 mb-2">
                Rarity Name
              </label>
              <input
                {...register('GemName', {
                  required: 'Gem name is required',
                  minLength: {
                    value: 2,
                    message: 'Gem name must be at least 2 characters',
                  },
                })}
                placeholder="Enter gem name"
                className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.GemName && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.GemName.message}
                </p>
              )}
            </div>

            {/* Gem Image */}
            <div>
              <label className="block font-semibold text-gray-200 mb-2">
                Rarity Image
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('GemImage', {
                  required: 'Gem image is required',
                  validate: {
                    isImage: files =>
                      files && files[0]?.type.startsWith('image/')
                        ? true
                        : 'Only image files are allowed',
                  },
                })}
                className="block w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.GemImage && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.GemImage.message}
                </p>
              )}
              {gemPreview && (
                <img
                  src={gemPreview}
                  alt="Gem Preview"
                  className="mt-3 w-36 h-36 object-cover rounded-lg shadow-md border border-gray-600"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all ${
                loading
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500'
              }`}
            >
              {loading ? 'Creating...' : 'Create Rarity Type'}
            </button>
          </form>

          {/* Status message */}
          {status && (
            <p
              className={`mt-5 text-center font-medium transition-all ${
                status.includes('successfully')
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRarityGem;
