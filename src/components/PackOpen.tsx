// src/components/PackOpen.tsx
import React, { useState } from 'react';
import './PackOpen.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../firebase';

const cards = [
  { name: 'Inferno Dragon', image: '/cards/inferno-dragon.png' },
  { name: 'Shadow Mage', image: '/cards/shadow-mage.png' },
  { name: 'Storm Beast', image: '/cards/storm-beast.png' },
  { name: 'Nature Dryad', image: '/cards/nature-dryad.png' },
  { name: 'Void Reaper', image: '/cards/void-reaper.png' }
];

const PackOpen: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const [flipped, setFlipped] = useState(Array(5).fill(false));
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleOpen = async () => {
    if (opened) return;
    setOpened(true);

    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    const currentXP = userSnap.exists() ? userSnap.data().xp || 0 : 0;

    await updateDoc(userRef, { xp: currentXP + 50 });

    for (const card of cards) {
      await addDoc(collection(db, 'users', user.uid, 'collection'), {
        name: card.name,
        image: card.image,
        obtainedAt: new Date()
      });
    }
  };

  const flipCard = (index: number) => {
    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);
  };

  return (
    <div className="pack-open-container">
      <h1>Open Your Pack</h1>
      <button onClick={handleOpen} disabled={opened}>
        {opened ? 'Pack Opened' : 'Open Pack'}
      </button>
      <div className="card-grid">
        {cards.map((card, idx) => (
          <div key={idx} className={`card ${flipped[idx] ? 'flipped' : ''}`} onClick={() => flipCard(idx)}>
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">
                <img src={card.image} alt={card.name} />
                <p>{card.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackOpen;
