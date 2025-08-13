// EditCardPage.tsx - With Default Collection Selection
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
  getDocs,
  collection,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, app } from '../firebase';

interface Card {
  id: string;
  fileName: string;
  imageUrl: string;
  cardName: string;
  collection: string;
  ownerId?: string;
  frameImgUrl: string;
  gemImageUrl: string;
  health: string;
  description: string;
  creatureType: string;
  attack: string;
  flavourText: string;
  cost: string;
}

const EditCardForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Partial<Card>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const db = getFirestore(app);
  const [RarityList, setRarityList] = useState<
    { id: string; name: string; file: string }[]
  >([]);
  const [CollectionList, setCollectionList] = useState<
    {
      id: string;
      collectionName: string;
      foilVersionFrame: string;
      normalFrame: string;
    }[]
  >([]);
  const [gemPreview, setGemPreview] = useState('');
  const [selectedGem, setSelectedGem] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [defaultSet, setDefaultSet] = useState(false);


  const fetCollection = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'collections'));
      const result = querySnapshot.docs.map(doc => ({
        id: doc.id,
        collectionName: doc.data().collectionName || 'Untitled',
        foilVersionFrame: doc.data().foilVersionFrame || '',
        normalFrame: doc.data().normalFrame || '',
      }));
      setCollectionList(result);
      return result; // Return for immediate use
    } catch (err) {
      console.error('Error fetching collection:', err);
      return [];
    }
  };

  const fetchRarity = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rarityGems'));
      const result = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().gemName || 'Untitled',
        file: doc.data().gemImageUrl || '',
      }));
      setRarityList(result);
      return result; // Return for immediate use
    } catch (err) {
      console.error('Error fetching rarity:', err);
      return [];
    }
  };

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) {
        setError('No card ID provided');
        setLoading(false);
        return;
      }

      try {
        setError(null);

        // Fetch all data in parallel
        const [cardData, rarityData, collectionData] = await Promise.all([
          getDoc(doc(db, 'cards', id)),
          fetchRarity(),
          fetCollection(),
        ]);

        if (cardData.exists()) {
          const cardInfo = { ...(cardData.data() as Card), id };
          setCard(cardInfo);

          // Find matching collection by NAME from the card data
          const matchingCollection = CollectionList.find(
            c => c.collectionName === cardInfo.collection
          );

          if (matchingCollection) {
            setSelectedCollection(matchingCollection.id);

            // Set frame image immediately based on the matching collection
            setCard(prev => ({
              ...prev,
              frameImgUrl: matchingCollection.normalFrame || '',
            }));
          }

          // Set default gem
          if (cardInfo.gemImageUrl && RarityList.length > 0) {
            const matchingGem = RarityList.find(
              gem => gem.file === cardInfo.gemImageUrl
            );
            if (matchingGem) {
              setSelectedGem(matchingGem.id);
            }
          }
        } else {
          setError('Card not found');
        }
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Failed to load card data');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [db, id]);
  useEffect(() => {
    if (!defaultSet && card && CollectionList.length > 0) {
      setSelectedCollection(card.collection || '');
  
      const matchingCollection = CollectionList.find(
        c => c.id === card.collection
      );
      if (matchingCollection) {
        setCard(prev => ({
          ...prev,
          frameImgUrl: matchingCollection.normalFrame || ''
        }));
      }
  
      setDefaultSet(true); // prevents running again
    }
  }, [card, CollectionList, defaultSet]);
  

  const handleGemFileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGemId = e.target.value;

    const selectedGem = RarityList.find(gem => gem.id === selectedGemId);

    if (selectedGem) {
      setSelectedGem(selectedGemId);
      setCard(prevCard => ({
        ...prevCard,
        gemImageUrl: selectedGem.file,
      }));
    }
  };

  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollection(collectionId);
  
    const foundCollection = CollectionList.find(c => c.id === collectionId);
    if (foundCollection) {
      setCard(prev => ({
        ...prev,
        collection: collectionId,
        frameImgUrl: foundCollection.normalFrame || ''
      }));
    }
  };
  

  const handleImageUpload = async (file: File, field: keyof Card) => {
    if (!file) return;

    setUploading(field);
    setError(null);

    try {
      const storageRef = ref(storage, `cards/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setCard(prev => ({ ...prev, [field]: url }));
      setSuccess(`${field} uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Failed to upload ${field}`);
    } finally {
      setUploading(null);
    }
  };

  const handleChange = (field: keyof Card, value: string) => {
    setCard(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateCard = (): string | null => {
    if (!card.cardName?.trim()) return 'Card name is required';
    if (!card.description?.trim()) return 'Description is required';
    if (!card.creatureType?.trim()) return 'Creature type is required';
    if (!card.attack || parseInt(card.attack) < 0)
      return 'Valid attack value is required';
    if (!card.health || parseInt(card.health) < 1)
      return 'Valid health value is required';
    return null;
  };

  const handleSave = async () => {
    const validationError = validateCard();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'cards', id!), card);
      setSuccess('Card saved successfully!');
      navigate('/menu/cards');
    } catch (err) {
      console.error('Error saving card:', err);
      setError('Failed to save card changes');
    } finally {
      setSaving(false);
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

  if (!card.id) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/menu/cards')}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white"
          >
            Back to Cards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Card</h1>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-600/20 border border-green-600 text-green-200 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="">
          {/* Form Section */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-gray-800 p-6 w-[60%] rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                Basic Information
              </h2>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">
                  Collection Name
                </label>
                <select
                  value={selectedCollection}
                  onChange={e => handleCollectionChange(e.target.value)}
                  className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="" disabled className="text-white">
                    select Collection
                  </option>
                  {CollectionList.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.collectionName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Card Name */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">
                  Card Name *
                </label>
                <input
                  type="text"
                  value={card.cardName || ''}
                  onChange={e => handleChange('cardName', e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter card name..."
                />
              </div>

              {/* Creature Type */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">
                  Creature Type *
                </label>
                <input
                  type="text"
                  value={card.creatureType || ''}
                  onChange={e => handleChange('creatureType', e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Dragon, Warrior, Beast..."
                />
              </div>

              {/* Attack and Health */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Attack *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={card.attack || ''}
                    onChange={e => handleChange('attack', e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Health *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={card.health || ''}
                    onChange={e => handleChange('health', e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              {/* Cost */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">
                  Cost *
                </label>
                <input
                  type="number"
                  min="0"
                  value={card.cost || ''}
                  onChange={e => handleChange('cost', e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">
                  Description *
                </label>
                <textarea
                  value={card.description || ''}
                  onChange={e => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Describe the card's abilities..."
                />
              </div>

              {/* Flavour Text */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">
                  Flavour Text
                </label>
                <textarea
                  value={card.flavourText || ''}
                  onChange={e => handleChange('flavourText', e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Optional flavor text..."
                />
              </div>

              {/* rarity gem */}
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-300">
                  Rarity Gem *
                </label>
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

                {card.gemImageUrl && (
                  <div className="mt-2">
                    <img
                      src={card.gemImageUrl}
                      alt="rarity-gem"
                      className="w-[80px] h-[80px] object-cover rounded border border-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-gray-800 p-6 w-[60%] rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Images</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Image Upload */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Main Image *
                  </label>

                  {card.imageUrl && (
                    <div className="mb-3">
                      <img
                        src={card.imageUrl}
                        alt="Main Image"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={e =>
                      e.target.files &&
                      handleImageUpload(e.target.files[0], 'imageUrl')
                    }
                    disabled={uploading === 'imageUrl'}
                    className="block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer cursor-pointer"
                  />

                  {uploading === 'imageUrl' && (
                    <div className="text-blue-400 text-sm mt-2">
                      Uploading...
                    </div>
                  )}
                </div>

                {/* Frame Options */}
                <div className="flex flex-col gap-4 mb-3">
                  <label className="text-gray-300 font-medium">
                    Select Frame
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Normal Frame */}
                    {selectedCollection && (
                      <div
                        onClick={() => {
                          const foundCollection = CollectionList.find(
                            c => c.id === selectedCollection
                          );
                          if (foundCollection) {
                            setCard(prev => ({
                              ...prev,
                              frameImgUrl: foundCollection.normalFrame,
                            }));
                          }
                        }}
                        className={`cursor-pointer border-2 rounded-lg ${
                          card.frameImgUrl ===
                          CollectionList.find(c => c.id === selectedCollection)
                            ?.normalFrame
                            ? 'border-purple-500'
                            : 'border-gray-600'
                        }`}
                      >
                        <img
                          src={
                            CollectionList.find(
                              c => c.id === selectedCollection
                            )?.normalFrame
                          }
                          alt="Normal Frame"
                          className="w-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Foil Frame */}
                    {selectedCollection && (
                      <div
                        onClick={() => {
                          const foundCollection = CollectionList.find(
                            c => c.id === selectedCollection
                          );
                          if (foundCollection) {
                            setCard(prev => ({
                              ...prev,
                              frameImgUrl: foundCollection.foilVersionFrame,
                            }));
                          }
                        }}
                        className={`cursor-pointer border-2 rounded-lg ${
                          card.frameImgUrl ===
                          CollectionList.find(c => c.id === selectedCollection)
                            ?.foilVersionFrame
                            ? 'border-purple-500'
                            : 'border-gray-600'
                        }`}
                      >
                        <img
                          src={
                            CollectionList.find(
                              c => c.id === selectedCollection
                            )?.foilVersionFrame
                          }
                          alt="Foil Frame"
                          className="w-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/menu/cards')}
            className="px-6 py-3 bg-gray-600 cursor-pointer hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading !== null}
            className="px-6 py-3 bg-green-600 cursor-pointer hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCardForm;
