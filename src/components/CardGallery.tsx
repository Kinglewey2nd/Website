// src/components/CardGallery.tsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import CardPreview from './CardPreview';
import './CardPreview.css';

interface CardData {
  id: string;
  name: string;
  type: string;
  description: string;
  attack: number;
  health: number;
  rarity: string;
  imageUrl: string;
  foilUrl?: string;
}

const CardGallery: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const navigate = useNavigate();

  const fetchCards = async () => {
    const querySnapshot = await getDocs(collection(db, 'cards'));
    const loadedCards: CardData[] = [];
    querySnapshot.forEach(docSnap => {
      loadedCards.push({ id: docSnap.id, ...docSnap.data() } as CardData);
    });
    setCards(loadedCards);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      await deleteDoc(doc(db, 'cards', id));
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const handleEdit = (card: CardData) => {
    navigate('/card-creator', { state: { card } });
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2>All Created Cards</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {cards.map(card => (
          <div key={card.id} style={{ textAlign: 'center' }}>
            <CardPreview
              name={card.name}
              type={card.type}
              description={card.description}
              attack={card.attack}
              health={card.health}
              rarity={card.rarity as any}
              imageUrl={card.imageUrl}
            />
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={() => handleEdit(card)}>✏️ Edit</button>
              <button
                onClick={() => handleDelete(card.id)}
                style={{ marginLeft: '0.5rem' }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGallery;
