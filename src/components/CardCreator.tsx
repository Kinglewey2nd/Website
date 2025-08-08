import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './CardCreator.css';

const inputs = [
  { name: 'cardName', label: 'Card Name', type: 'text' },
  { name: 'creatureType', label: 'Creature Type', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'health', label: 'Health', type: 'number' },
  { name: 'attack', label: 'Attack', type: 'number' },
  { name: 'flavour text', label: 'Flavour Text', type: 'text' },
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
    { id: string; name: string }[]
  >([]);
  const [RarityList, setRarityList] = useState<
    { id: string; name: string; file: string }[]
  >([]);
  const [selectedGem, setSelectedGem] = useState('');

  const fetchRaarity = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rarityGems'));
      const result = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().gemName || 'Untitled',
        file: doc.data().fileName || '',
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

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      setStatus('Must be logged in to upload.');
      return;
    }

    if (!file || !gemFile) {
      setStatus('Please upload both card image and rarity gem image.');
      return;
    }

    try {
      setLoaading(true);

      await addDoc(collection(db, 'cards'), {
        ownerId: user.uid,
        imageUrl: preview,
        gemImageUrl: gemPreview,
        ...data,
        createdAt: new Date().toISOString(),
      });

      setStatus('Card created successfully!');
      setLoaading(false);
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

  return (
    <div className="p-10 h-screen">
      <button
        className="w-[250px] px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
        onClick={() => navigate(-1)}
      >
        Back to menu
      </button>

      <div className="card-creator-container flex gap-6 min-h-screen text-white p-6">
        {/* Form Section */}
        <div className="form-section md:w-1/2 bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xlp-6 shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Create Card</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                value={selectedGem} // bind the value
                onChange={e => {
                  const value = e.target.value;
                  setSelectedGem(value); // update selected
                  const foundGem = RarityList.find(gem => gem.file === value);
                  setGemPreview(foundGem ? foundGem.file : '');
                }}
                className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="" disabled>
                  Select Rarity Type
                </option>
                {RarityList.map(gem => (
                  <option key={gem.id} value={gem.file}>
                    {gem.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Collection Name <sup className="text-pink-700 text-base">*</sup>
              </label>
              <select
                {...register('collection', {
                  required: 'Collection Name is required',
                })}
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
              className="w-[150px] px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition"
            >
              {loading ? 'Creating...' : 'Create Card'}
            </button>
          </form>

          <p className="mt-4 text-green-400">{status}</p>
        </div>

        {/* Preview Section */}
        <div className="md:w-1/2">
          <div className="relative w-1/2 max-h-full left-60 bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 text-white">
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
              {watch('cardName') || 'Card Name'}
            </div>
            <div className="italic text-gray-300">
              {watch('creatureType') || 'Creature Type'}
            </div>
            <div className="text-sm overflow-hidden break-words">
              {watch('description') || 'Card Description'}
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-red-400">
                ❤️ {watch('health') || 'Health'}
              </span>
              <span className="text-blue-400">
                ⚔️ {watch('attack') || 'Attack'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreator;
