import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { db } from '@/firebase';
import useAuth from '@/useAuth';
import {  ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {storage} from '@/firebase';


type FormValues = {
  collectionName: string;
  FlavorText: string;
  NormalFrame: FileList;
  FoilVersionFrame: FileList;
};

const CreateCollection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [preview, setPreview] = useState('');
  const [gemPreview, setGemPreview] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>();

  // Watch file inputs to update previews
  const normalFrameFile = watch('NormalFrame');
  const foilFrameFile = watch('FoilVersionFrame');

  React.useEffect(() => {
    if (normalFrameFile && normalFrameFile.length > 0) {
      setPreview(URL.createObjectURL(normalFrameFile[0]));
    }
  }, [normalFrameFile]);

  React.useEffect(() => {
    if (foilFrameFile && foilFrameFile.length > 0) {
      setGemPreview(URL.createObjectURL(foilFrameFile[0]));
    }
  }, [foilFrameFile]);

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      setStatus('⚠️ You must be signed in to create a collection.');
      return;
    }
   

    try {
      setLoading(true);
      const normalFrameFile = data.NormalFrame[0];
      const normalRef = ref(storage, `collections/${Date.now()}-${normalFrameFile.name}`);
      await uploadBytes(normalRef, normalFrameFile);
      const normalFrameURL = await getDownloadURL(normalRef);
  
      // Upload Foil Frame
      const foilFrameFile = data.FoilVersionFrame[0];
      const foilRef = ref(storage, `collections/${Date.now()}-${foilFrameFile.name}`);
      await uploadBytes(foilRef, foilFrameFile);
      const foilFrameURL = await getDownloadURL(foilRef);

      // Save collection data in Firestore
      await addDoc(collection(db, 'collections'), {
        collectionName: data.collectionName,
        flavorText: data.FlavorText,
        normalFrame: normalFrameURL,
        foilVersionFrame: foilFrameURL,
        ownerId: user.uid,
        createdAt: new Date(),
      });

      setStatus('Collection created successfully!');
      reset();
      setPreview('');
      setGemPreview('');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error('Firestore save error:', err);
      setStatus('Failed to save collection. Try again.');
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
    <div className="p-10 h-screen">

      <div className="flex items-center justify-center mt-40">
        <div className="md:w-[40%] bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">
            Create Collection
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Collection Name */}
            <div>
              <label className="block font-semibold text-gray-100 mb-1">
                Collection Name <sup className="text-pink-700 text-base">*</sup>
              </label>
              <input
                {...register('collectionName', {
                  required: 'Collection name is required',
                })}
                className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.collectionName && (
                <p className="text-red-400 text-sm">
                  {errors.collectionName.message}
                </p>
              )}
            </div>

            {/* Flavor Text */}
            <div>
              <label className="block font-semibold text-gray-100 mb-1">
                Flavor Text
              </label>
              <input
                {...register('FlavorText', {})}
                className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.FlavorText && (
                <p className="text-red-400 text-sm">
                  {errors.FlavorText.message}
                </p>
              )}
            </div>

            {/* Normal Frame */}
            <div>
              <label className="block font-semibold text-gray-100 mb-1">
                Normal Frame <sup className="text-pink-700 text-base">*</sup>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('NormalFrame', {
                  required: 'Normal frame is required',
                })}
                className="block w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.NormalFrame && (
                <p className="text-red-400 text-sm">
                  {errors.NormalFrame.message}
                </p>
              )}
              {preview && (
                <img src={preview} alt="NormalFrame" style={{ width: 150 }} />
              )}
            </div>

            {/* Foil Version Frame */}
            <div>
              <label className="block font-semibold text-gray-100 mb-1">
                Foil Version Frame{' '}
                <sup className="text-pink-700 text-base">*</sup>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('FoilVersionFrame', {
                  required: 'Foil version frame is required',
                })}
                className="block w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200
                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.FoilVersionFrame && (
                <p className="text-red-400 text-sm">
                  {errors.FoilVersionFrame.message}
                </p>
              )}
              {gemPreview && (
                <img
                  src={gemPreview}
                  alt="FoilVersionFrame"
                  style={{ width: 150 }}
                />
              )}
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-500"
            >
              {loading ? 'Creating...' : 'Create Collection'}
            </button>
          </form>

          <p className="mt-4 text-green-500 font-medium text-center">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateCollection;
