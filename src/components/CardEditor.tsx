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
import { app } from '../firebase';
import useAuth from '../useAuth';

interface Card {
  id: string;
  fileName: string;
  imageUrl: string;
  cardName: string;
  ownerId?: string;
}

const CardEditor: React.FC = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const db = getFirestore(app);
  const functions = getFunctions(app);
  const deleteCardImage = httpsCallable(functions, 'deleteCardImage');

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'cards'));

        console.log('snapshot', snapshot);

        const cardList = snapshot.docs.map(doc => {
          return {
            ...(doc.data() as Card),
            id: doc.id,
          };
        });

        console.log('cardList', cardList);

        setCards(cardList);

        // Log image URLs for debugging
        cardList.forEach(card => {
          console.log('Image URL:', card.imageUrl);
        });
      } catch (err) {
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [db]);

  if (!user) return <p>Please log in to view and edit your cards.</p>;

  if (loading) return <p>Loading cards...</p>;

  const handleDelete = async (card: Card) => {
    if (
      !window.confirm(`Delete card "${card.cardName}"? This cannot be undone.`)
    )
      return;

    try {
      await deleteDoc(doc(db, 'cards', card.id));
      await deleteCardImage({ fileName: card.fileName });
      setCards(prev => prev.filter(c => c.id !== card.id));
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card. Please try again.');
    }
  };

  const startEditing = (card: Card) => {
    setEditingId(card.id);
    setEditingName(card.cardName);
  };

  const saveEdit = async (card: Card) => {
    if (!editingName.trim()) {
      alert('Card name cannot be empty.');
      return;
    }
    try {
      await updateDoc(doc(db, 'cards', card.id), {
        cardName: editingName.trim(),
      });
      setCards(prev =>
        prev.map(c =>
          c.id === card.id ? { ...c, cardName: editingName.trim() } : c
        )
      );
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Edit All Cards</h2>
      {cards.length === 0 && <p>No cards found.</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {cards.map(card => (
          <div
            key={card.id}
            style={{
              border: '1px solid #ccc',
              padding: '0.5rem',
              width: 200,
              textAlign: 'center',
            }}
          >
            <img
              src={card.imageUrl}
              alt={card.cardName}
              style={{ width: '100%', height: 'auto' }}
            />
            {editingId === card.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  style={{ width: '90%', marginTop: '0.5rem' }}
                />
                <br />
                <button
                  onClick={() => saveEdit(card)}
                  style={{ marginTop: '0.5rem' }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p style={{ marginTop: '0.5rem', wordBreak: 'break-word' }}>
                  {card.cardName}
                </p>
                <button onClick={() => startEditing(card)}>Edit Name</button>
                <button
                  onClick={() => handleDelete(card)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardEditor;
