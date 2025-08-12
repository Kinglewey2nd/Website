import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './CardCreator.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { Toaster, toast } from 'react-hot-toast';

const inputs = [
  { name: 'cardName', label: 'Card Name', type: 'text' },
  { name: 'creatureType', label: 'Creature Type', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'health', label: 'Health', type: 'number' },
  { name: 'attack', label: 'Attack', type: 'number' },
  { name: 'flavourText', label: 'Flavour Text', type: 'text' },
];

interface FormValues {
  collection: string;
  cardName: string;
  creatureType: string;
  description: string;
  health: string;
  attack: string;
  flavourtext: string;
}

const CardCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      collection: '',
      cardName: '',
      creatureType: '',
      description: '',
      health: '',
      attack: '',
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [gemFile, setGemFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [gemPreview, setGemPreview] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoaading] = useState(false);
  const [collectionsList, setCollectionsList] = useState<
    {
      id: string;
      name: string;
      normalFrame: string;
      foilVersionFrame: string;
    }[]
  >([]);
  const [RarityList, setRarityList] = useState<
    { id: string; name: string; file: string }[]
  >([]);
  const [selectedGem, setSelectedGem] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('');
  const [useFoilFrame, setUseFoilFrame] = useState(false);

  const fetchRaarity = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rarityGems'));
      const result = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().gemName || 'Untitled',
        file: doc.data().gemImageUrl || '',
      }));
      setRarityList(result);
    } catch (err) {
      console.error('Error fetching rarity:', err);
    }
  };
  const fetchCollections = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'collections'));
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().collectionName || 'Untitled',
        normalFrame: doc.data().normalFrame || '',
        foilVersionFrame: doc.data().foilVersionFrame || '',
      }));
      setCollectionsList(fetched);
    } catch (err) {
      console.error('Error fetching collections:', err);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchRaarity();
  }, []);
  console.log('collection ;', collectionsList);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'main' | 'gem'
  ) => {
    const selected = e.target.files?.[0] || null;
    if (type === 'main') {
      setFile(selected);
      if (selected) setPreview(URL.createObjectURL(selected));
    }
  };
  const handleGemFileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedGem(value);

    // match by ID, not file
    const foundGem = RarityList.find(gem => gem.id === value);
    setGemPreview(foundGem ? foundGem.file : '');
    console.log('Selected gem:', foundGem);
  };

  const handleFrameTypeChange = (type: 'normal' | 'foil') => {
    setUseFoilFrame(type === 'foil');

    // update the frame immediately if a collection is already chosen
    const foundCol = collectionsList.find(
      col => col.id === watch('collection')
    );
    if (foundCol) {
      setSelectedFrame(
        type === 'foil' ? foundCol.foilVersionFrame : foundCol.normalFrame
      );
    }
  };

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const foundCol = collectionsList.find(col => col.id === value);
    if (foundCol) {
      setSelectedFrame(
        useFoilFrame ? foundCol.foilVersionFrame : foundCol.normalFrame
      );
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      setStatus('Must be logged in to upload.');
      return;
    }

    if (!file) {
      setStatus('Please upload a card image.');
      return;
    }

    try {
      setLoaading(true);
      const storageRef = ref(storage, `cards/${file.name}`);
      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'cards'), {
        ownerId: user.uid,
        imageUrl: imageUrl,
        gemImageUrl: gemPreview,
        frameImgUrl: selectedFrame,
        ...data,
        createdAt: new Date().toISOString(),
      });

      setLoaading(false);
      toast.success('Card created successfully!', {
        duration: 5000,
      });
      reset();
      setFile(null);
      setGemFile(null);
      setPreview('');
      setGemPreview('');
    } catch (err: any) {
      setLoaading(false);
      console.error('Upload error:', err);
      setStatus(`Upload failed: ${err.message || err}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen backdrop-blur-md ">
        <div className="text-center p-8 bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 h-screen">
      <Toaster/>

      <div className="card-creator-container flex gap-6 min-h-screen text-white p-6">
        {/* Form Section */}
        <div className="form-section md:w-1/2 bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xlp-6 shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Create Card</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block mb-1 font-medium">
                Collection Name <sup className="text-pink-700 text-base">*</sup>
              </label>
              <select
                {...register('collection', {
                  required: 'Collection Name is required',
                })}
                onChange={e => handleCollectionChange(e)}
                className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="" disabled className="text-white">
                  Select a collection
                </option>
                {collectionsList.map(col => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center mb-4  rounded-xl p-4 ">
              <label className="flex items-center cursor-pointer group mr-6">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={!useFoilFrame}
                    onChange={() => handleFrameTypeChange('normal')}
                    className="appearance-none w-5 h-5 bg-gray-800/80 border-2 border-gray-600 rounded focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 checked:bg-gradient-to-br checked:from-purple-600 checked:to-purple-700 checked:border-purple-500 transition-all duration-200 hover:border-purple-400 hover:shadow-sm hover:shadow-purple-400/20"
                  />
                  {!useFoilFrame && (
                    <svg
                      className="absolute inset-0 w-5 h-5 text-white pointer-events-none"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="ml-3 text-white font-medium group-hover:text-purple-300 transition-colors duration-200 select-none">
                  Normal Frame
                </span>
              </label>

              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={useFoilFrame}
                    onChange={() => handleFrameTypeChange('foil')}
                    className="appearance-none w-5 h-5 bg-gray-800/80 border-2 border-gray-600 rounded focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 checked:bg-gradient-to-br checked:from-purple-600 checked:to-purple-700 checked:border-purple-500 transition-all duration-200 hover:border-purple-400 hover:shadow-sm hover:shadow-purple-400/20"
                  />
                  {useFoilFrame && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {/* Foil shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded"></div>
                    </div>
                  )}
                </div>
                <span className="ml-3 text-white font-medium group-hover:text-purple-300 transition-colors duration-200 select-none">
                  Foil Version
                </span>
              </label>
            </div>

            <div>
              <label className="block mb-1 font-medium">Card Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(e, 'main')}
                className="block w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200
                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Rarity Gem </label>
              <select
                value={selectedGem}
                onChange={e => handleGemFileChange(e)}
                className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="" disabled className="text-white">
                  Select Rarity Type
                </option>
                {RarityList.map(gem => (
                  <option key={gem.id} value={gem.id}>
                    {gem.name}
                  </option>
                ))}
              </select>
            </div>

            {inputs.map(field => (
              <div key={field.name}>
                <label className="block mb-1 font-medium">
                  {field.label} <sup className="text-pink-700 text-base">*</sup>
                </label>
                {field.type === 'textarea' && (
                  <textarea
                    {...register(field.name as keyof FormValues, {
                      required: `${field.label} is required`,
                    })}
                    className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                )}
                {field.type === 'text' && (
                  <input
                    {...register(field.name as keyof FormValues, {
                      required: `${field.label} is required`,
                    })}
                    className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                )}

                {field.type === 'number' && (
                  <input
                    type="number"
                    {...register(field.name as keyof FormValues, {
                      required: `${field.label} is required`,
                      valueAsNumber: true,
                    })}
                    className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                )}
                {errors[field.name as keyof FormValues] && (
                  <p className="text-red-400 text-sm">
                    {errors[field.name as keyof FormValues]?.message}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-[150px] px-4 cursor-pointer py-2 bg-green-600 hover:bg-green-500 text-white rounded transition"
            >
              {loading ? 'Creating...' : 'Create Card'}
            </button>
          </form>

          <p className="mt-4 text-red-400">{status}</p>
        </div>

        {/* Preview Section */}
        {/* Preview Section */}
        <div className="md:w-1/2 flex justify-center">
          {selectedFrame  && (
            <div className="relative w-full h-full">
            {/* Card art (behind the frame) */}
            {preview ? (
              <img
                src={preview}
                alt="card-art"
                className="absolute left-52 top-[35px] w-[400px] h-[400px] object-cover rounded-md z-0"
              />
            ) : (
              <div className=" absolute left-52 bg-gray-700 text-white flex items-center justify-center top-[35px] w-[400px] h-[400px] object-cover rounded-md z-0">
                Upload Image{' '}
              </div>
            )}

            {/* Frame */}
            {/* Frame */}
            {selectedFrame && (
              <img
                src={selectedFrame}
                alt="card-frame"
                className="absolute w-[500px] h-[700px] left-40 z-10 pointer-events-none"
              />
            )}

            {/* Rarity Gem */}
            {gemPreview && (
              <img
                src={gemPreview}
                alt="rarity-gem"
                className="absolute top-[46px] left-[533px] w-[80px] h-[80px] z-20"
              />
            )}

            {/* Card text overlay */}
            <div className="absolute top-[420px] left-[150px] right-[30px] z-20 text-center">
              <div className="text-lg font-bold">
                {watch('cardName') || 'Card Name'}
              </div>
              <div className="italic text-gray-300 mt-4">
                {watch('creatureType') || 'Creature Type'}
              </div>
              <div className="text-sm break-words mt-3 max-w-[280px] ml-[24%]">
                {watch('description') || 'Card Description'}
              </div>
            </div>

            {/* Stats */}
            <div className="absolute top-[580px] left-[31%]  z-20 text-sm font-bold">
              <span className="text-amber-300 text-2xl">
                {watch('health') || '0'}
              </span>
            </div>
            <div className="absolute top-[580px] left-[79%] z-20 text-sm font-bold">
              <span className="text-amber-300 text-2xl">
                {watch('attack') || '0'}
              </span>
            </div>
          </div>
          )}
          {
            !selectedFrame && (
              <div className="bg-gray-700 text-white flex items-center justify-center rounded-md  w-[500px] h-[700px] left-60 z-10 pointer-events-none">
                Select a collection to see the card preview
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default CardCreator;
