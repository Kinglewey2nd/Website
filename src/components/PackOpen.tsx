// src/components/PackOpen.tsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

const cards = [
  { name: 'Inferno Dragon', image: '/cards/inferno-dragon.png' },
  { name: 'Shadow Mage', image: '/cards/shadow-mage.png' },
  { name: 'Storm Beast', image: '/cards/storm-beast.png' },
  { name: 'Nature Dryad', image: '/cards/nature-dryad.png' },
  { name: 'Void Reaper', image: '/cards/void-reaper.png' },
];

const PackOpen: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const [flipped, setFlipped] = useState(Array(cards.length).fill(false));
  const [loading, setLoading] = useState(false);
  const [showXPBanner, setShowXPBanner] = useState(false);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleOpenPack = async () => {
    if (opened) return;
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      await setDoc(userDocRef, {
        collection: [],
        xp: 0,
        level: 1,
      });
    }

    const newCards = cards.map((card) => ({
      ...card,
      id: crypto.randomUUID(),
    }));

    await updateDoc(userDocRef, {
      collection: [...(userSnap.data()?.collection || []), ...newCards],
      xp: (userSnap.data()?.xp || 0) + 50,
    });

    setOpened(true);
    setLoading(false);
    setShowXPBanner(true);

    // Hide XP banner after 3 seconds
    setTimeout(() => setShowXPBanner(false), 3000);
  };

  const handleCardClick = (index: number) => {
    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);
  };

  return (
    <div className="pack-open-container">
      <h1>Pack Opening</h1>

      {showXPBanner && (
        <div style={{
          backgroundColor: '#222',
          color: '#FFD700',
          padding: '1rem 2rem',
          borderRadius: '12px',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          animation: 'fadein 0.5s ease-in-out',
        }}>
          🎉 You gained 50 XP!
        </div>
      )}

      {!opened && (
        <button onClick={handleOpenPack} disabled={loading}>
          {loading ? 'Opening...' : 'Open Pack'}
        </button>
      )}

      {opened && (
        <div className="card-grid">
          {cards.map((card, index) => (
            <div
              className={`card ${flipped[index] ? 'flipped' : ''}`}
              key={index}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">
                  <img src={card.image} alt={card.name} />
                  <div>{card.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackOpen;
