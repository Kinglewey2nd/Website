import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getFirestore,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { app } from '../firebase';

interface Card {
  id: string;
  fileName: string;
  imageUrl: string;
  cardName: string;
  ownerId?: string;
  frameImgUrl: string;
  gemImageUrl: string;
  health: string;
  description: string;
  creatureType: string;
  attack: string;
  flavourText: string;
}

const CardEditor: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Card>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [RarityList, setRarityList] = useState<
    { id: string; name: string; file: string }[]
  >([]);

  const db = getFirestore(app);
  const functions = getFunctions(app);
  const deleteCardImage = httpsCallable(functions, 'deleteCardImage');

  const fetchRarity = async () => {
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

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'cards'));
        const cardList = snapshot.docs.map(docSnap => ({
          ...(docSnap.data() as Card),
          id: docSnap.id,
        }));
        setCards(cardList);
      } catch (err) {
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
    fetchRarity();
  }, [db]);
  console.log('gems ;', RarityList);

  const handleImageUpload = async (
    file: File,
    imageType: 'main' | 'gem' | 'frame'
  ) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `cards/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const globalUrl = await getDownloadURL(storageRef);

      const fieldMap = {
        main: 'imageUrl',
        gem: 'gemImageUrl',
        frame: 'frameImgUrl',
      };

      handleChange(fieldMap[imageType] as keyof Card, globalUrl);

      if (imageType === 'main') {
        setImagePreview(globalUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
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

  const handleDelete = async (card: Card) => {
    if (
      !window.confirm(`Delete card "${card.cardName}"? This cannot be undone.`)
    )
      return;
    try {
      await deleteDoc(doc(db, 'cards', card.id));
      setCards(prev => prev.filter(c => c.id !== card.id));
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card. Please try again.');
    }
  };

  const startEditing = (card: Card) => {
    setEditingId(card.id);
    setEditingData({ ...card });
    setImagePreview(card.imageUrl);
  };

  const saveEdit = async (card: Card) => {
    try {
      setLoading(true);
      const updated = { ...editingData };
      await updateDoc(doc(db, 'cards', card.id), updated);
      setCards(prev =>
        prev.map(c => (c.id === card.id ? { ...c, ...updated } : c))
      );
      setLoading(false);
      setEditingId(null);
      setEditingData({});
      setImagePreview('');
    } catch (error) {
      setLoading(false);
      console.error('Error updating card:', error);
      alert('Failed to update card. Please try again.');
    }
  };

  const handleChange = (field: keyof Card, value: string) => {
    setEditingData(prev => ({ ...prev, [field]: value }));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData({});
    setImagePreview('');
  };

  return (
    <div className="min-h-screen  p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 ">Card Editor</h1>
      </div>

      {cards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white text-xl">No cards found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card.id} className="group">
            {editingId === card.id ? (
              /* Edit Mode */
              <div className='p-6 w-[60vw] absolute right-64 z-50  max-h-[80vh] overflow-y-autorounded-xl shadow-2xl'>
                <div className=" bg-black/40 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 p-10">
                <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                  Edit Card
                </h3>

                <div className="space-y-4">
                  {/* Card Name */}
                  <div>
                    <label className=" text-sm font-medium text-gray-300 mb-1">
                      Card Name
                    </label>
                    <input
                      type="text"
                      value={editingData.cardName || ''}
                      onChange={e => handleChange('cardName', e.target.value)}
                      className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Enter card name"
                    />
                  </div>

                  {/* Creature Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Creature Type
                    </label>
                    <input
                      type="text"
                      value={editingData.creatureType || ''}
                      onChange={e =>
                        handleChange('creatureType', e.target.value)
                      }
                      className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Enter creature type"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingData.description || ''}
                      onChange={e =>
                        handleChange('description', e.target.value)
                      }
                      className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 h-24 resize-none"
                      placeholder="Enter description"
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Attack
                      </label>
                      <input
                        type="number"
                        value={editingData.attack || ''}
                        onChange={e => handleChange('attack', e.target.value)}
                        className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Health
                      </label>
                      <input
                        type="number"
                        value={editingData.health || ''}
                        onChange={e => handleChange('health', e.target.value)}
                        className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>

                  {/* Flavour Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Flavour Text
                    </label>
                    <input
                      type="text"
                      value={editingData.flavourText || ''}
                      onChange={e =>
                        handleChange('flavourText', e.target.value)
                      }
                      className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Enter flavour text"
                    />
                  </div>

                  <div className=" grid grid-cols-2">
                    {/* Main Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Main Image
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'main');
                          }}
                          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                          disabled={uploadingImage}
                        />
                        {(imagePreview || editingData.imageUrl) && (
                          <div className="relative">
                            <img
                              src={imagePreview || editingData.imageUrl}
                              alt="Preview"
                              className="w-[60%] h-32 object-cover rounded-lg border border-gray-600"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gem Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Gem Image
                      </label>
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <select
                            value={
                              RarityList.find(
                                gem => gem.file === editingData.gemImageUrl
                              )?.id || ''
                            }
                            onChange={e => {
                              const selectedGem = RarityList.find(
                                gem => gem.id === e.target.value
                              );
                              if (selectedGem) {
                                setEditingData(prev => ({
                                  ...prev,
                                  gemImageUrl: selectedGem.file,
                                  gemName: selectedGem.name,
                                }));
                              }
                            }}
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
                        {editingData.gemImageUrl && (
                          <img
                            src={editingData.gemImageUrl}
                            alt="Gem Preview"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                          />
                        )}
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Frame Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Frame Image
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'frame');
                        }}
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                        disabled={uploadingImage}
                      />
                      {editingData.frameImgUrl && (
                        <img
                          src={editingData.frameImgUrl}
                          alt="Frame Preview"
                          className="w-24 h-32 object-cover rounded-lg border border-gray-600"
                        />
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => saveEdit(card)}
                      disabled={uploadingImage}
                      className="flex-1 bg-green-600 hover:bg-green-500 cursor-pointer disabled:bg-green-600/50 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <span></span> Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={uploadingImage}
                      className="flex-1 bg-gray-600 cursor-pointer hover:bg-red-600 disabled:bg-gray-600/50 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <span></span> Cancel
                    </button>
                  </div>
                </div>
              </div>
              </div>
            ) : (
              /* View Mode */
              <div className="relative">
                {/* Hover Action Buttons - Top Right */}
                <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <button
                    onClick={() => startEditing(card)}
                    className="bg-purple-600/90 hover:bg-purple-500 text-white p-2 rounded-lg cursor-pointer backdrop-blur-sm transition-all duration-200 shadow-lg"
                    title="Edit Card"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(card)}
                    className="bg-red-600/90 hover:bg-red-500 text-white p-2 cursor-pointer rounded-lg backdrop-blur-sm transition-all duration-200 shadow-lg"
                    title="Delete Card"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* Card Preview */}
                <div className="">
                  {card.imageUrl && (
                    <img
                      src={card.imageUrl}
                      alt={card.cardName}
                      className="absolute left-20 top-[35px] w-[400px] h-[400px] object-cover rounded-md z-0"
                    />
                  )}
                  {card.frameImgUrl && (
                    <img
                      src={card.frameImgUrl}
                      alt="Frame"
                      className=" absolute w-[500px] h-[700px] left-10 z-10 pointer-events-none"
                    />
                  )}
                  {card.gemImageUrl && (
                    <img
                      src={card.gemImageUrl}
                      alt="Gem"
                      className="absolute top-[44px] left-[412px] w-[80px] h-[80px] z-20"
                    />
                  )}
                  <div className="absolute top-[400px] left-[120px] right-[30px] z-20 text-center">
                    <div className="text-lg font-bold">{card.cardName}</div>
                    <div className="italic text-gray-300 mt-4">
                      {card.creatureType}
                    </div>
                    <div className="text-sm break-words mt-3 max-w-[280px] ml-[10%]">
                      {card.description}
                    </div>
                  </div>
                  <div className="absolute top-[560px] left-[21%]  z-20 text-sm font-bold">
                    <span className="text-amber-300 text-2xl">
                      {card.attack}
                    </span>
                  </div>
                  <div className="absolute top-[560px] left-[90%] z-20 text-sm font-bold">
                    <span className="text-amber-300 text-2xl">
                      {card.health}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardEditor;
