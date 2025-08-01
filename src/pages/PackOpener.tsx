import React, { useState } from 'react';
import CardDisplay from '../components/CardDisplay';
import { sampleCards } from '../utils/cardData';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const getRandomCard = () => {
  const weights = { Common: 60, Rare: 25, Epic: 10, Mythic: 5 };
  const total = Object.values(weights).reduce((a, b) => a + b);
  const rand = Math.random() * total;
  let sum = 0;
  for (const rarity in weights) {
    sum += weights[rarity];
    if (rand < sum) {
      const pool = sampleCards.filter((card) => card.rarity === rarity);
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return sampleCards[0];
};

const PackOpener: React.FC = () => {
  const [openedCards, setOpenedCards] = useState<any[]>([]);
  const user = auth.currentUser;

  const handleOpenPack = async () => {
    if (!user) return;

    const newCards = Array.from({ length: 5 }, getRandomCard);
    setOpenedCards(newCards);

    for (const card of newCards) {
      await addDoc(collection(db, 'users', user.uid, 'collection'), {
        ...card,
        timestamp: serverTimestamp()
      });
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Open a Card Pack</h2>
      <button onClick={handleOpenPack} style={{ marginBottom: '1rem' }}>
        Open Pack
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
        {openedCards.map((card, idx) => (
          <CardDisplay key={idx} {...card} />
        ))}
      </div>
    </div>
  );
};

export default PackOpener;