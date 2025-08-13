import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getFirestore,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
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
  collection: string;
  attack: string;
  flavourText: string;
  cost: string;
}

const CardEditor: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const db = getFirestore(app);
  const navigate = useNavigate();
  const [CollectionList, setCollectionList] = useState<
    {
      id: string;
      collectionName: string;
    }[]
  >([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [deletModal, setDeleteModal] = useState(false);
  const [idFordelete,setIdFordelete] = useState<string>('');

  const fetchCollection = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'collections'));
      const collectionList = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as { collectionName: string }),
      }));
      setCollectionList(collectionList);
    } catch (error) {
      console.error('Error fetching collections:', error);
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
    fetchCollection();
  }, [db]);
  console.log('Collection List:', CollectionList);

  const handleDelete = async (card: Card) => {
    setDeleting(card.id);
    try {
      await deleteDoc(doc(db, 'cards', card.id));
      setCards(prev => prev.filter(c => c.id !== card.id));

      // Optionally delete associated images
      // await deleteCardImage({ cardId: card.id });
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const filteredCards = selectedCollection ?cards.filter(card => card.collection === selectedCollection) : cards; 

  const handleEdit = (cardId: string) => {
    navigate(`/menu/edit-card/${cardId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen backdrop-blur-md ">
      <div className="text-center p-8 bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white text-xl">Loading Cards...</p>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Cards</h1>
      </div>
      <div>
        <select
          className="w-[20%] bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={selectedCollection}
          onChange={e => setSelectedCollection(e.target.value)}
        >
          <option value="">All Collections</option>
          {CollectionList.map(collection => (
            <option key={collection.id} value={collection.id}>
              {collection.collectionName}
            </option>
          ))}
        </select>
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 max-w-md mx-auto">
            <div className="text-gray-400 text-6xl mb-4"></div>
            <p className="text-white text-xl mb-2">No cards found</p>
            <p className="text-gray-400">
              Create your first card to get started!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 -ml-10">
        {filteredCards.map(card => (
          <div key={card.id} className="group relative">
            {/* Hover Action Buttons - Top Right */}
            <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <button
                onClick={() => handleEdit(card.id)}
                className="bg-purple-600/90 hover:bg-purple-500 text-white p-2 rounded-lg cursor-pointer backdrop-blur-sm transition-all duration-200 shadow-lg "
                title="Edit Card"
                disabled={deleting === card.id}
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
                onClick={() => {
                  setDeleteModal(true);
                  setIdFordelete(card.id);
                }}
                disabled={deleting === card.id}
                className="bg-red-600/90 hover:bg-red-500 disabled:bg-gray-600/90 text-white p-2 cursor-pointer rounded-lg backdrop-blur-sm transition-all duration-200 shadow-lg"
                title="Delete Card"
              >
                {deleting === card.id ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
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
                )}
              </button>
            </div>

            {/* Card Preview - Original Design */}
            <div className="relative h-[700px]">
              {/* Main Card Image */}
              {card.imageUrl && (
                <img
                  src={card.imageUrl}
                  alt={card.cardName}
                  className="absolute left-20 top-[45px] w-[400px] h-[400px] object-cover rounded-md z-0"
                />
              )}

              {/* Card Frame */}
              {card.frameImgUrl && (
                <img
                  src={card.frameImgUrl}
                  alt="Frame"
                  className="absolute w-[500px] h-[700px] left-10 z-10 pointer-events-none"
                />
              )}
              <div className='text-amber-300 text-2xl font-extrabold font-[cinzel] absolute left-[116px] top-[80px] z-50'>{card.cost}</div>

              {/* Rarity Gem */}
              {card.gemImageUrl && (
                <img
                  src={card.gemImageUrl}
                  alt="Gem"
                  className="absolute top-[46px] left-[412px] w-[80px] h-[80px] z-20"
                />
              )}

              {/* Card Text Content */}
              <div className="absolute top-[420px] left-[110px] right-[30px] z-20 text-center">
                <div className="text-lg font-bold">{card.cardName}</div>
                <div className="italic text-gray-300 mt-4">
                  {card.creatureType}
                </div>
                <div className="text-sm break-words mt-3 max-w-[280px] ml-[10%]">
                  {card.description}
                </div>
              </div>

              {/* Attack and Health Stats */}
              <div className="absolute top-[580px] left-[19%] z-20 text-sm font-bold">
                <span className="text-amber-300 font-[cinzel] text-2xl">{card.attack}</span>
              </div>
              <div className="absolute top-[580px] left-[86%] z-20 text-sm font-bold">
                <span className="text-amber-300 font-[cinzel] text-2xl">{card.health}</span>
              </div>

              {/* Loading overlay when deleting */}
              {deleting === card.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
                  <div className="text-white text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p>Deleting...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button for Adding New Card */}
      <button
        onClick={() => navigate('/create-card')}
        className="fixed bottom-8 right-8 bg-purple-600 cursor-pointer hover:bg-purple-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
        title="Create New Card"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
      <div>
        {/* Delete Confirmation Modal */}
        {deletModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this card?</p>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="px-4 py-2 cursor-pointer bg-gray-600 hover:bg-gray-500 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const cardToDelete = cards.find(card => card.id === idFordelete);
                    if (cardToDelete) {
                      handleDelete(cardToDelete);
                    }
                    setDeleteModal(false);
                  }}
                  className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-500 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardEditor;
