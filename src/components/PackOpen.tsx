
import React, { useState } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, updateDoc, doc, increment } from 'firebase/firestore';

const PackOpen: React.FC = () => {
  const [cards, setCards] = useState<string[]>([]);
  const [opened, setOpened] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const openPack = async () => {
    const drawn = ['Inferno Dragon', 'Shadow Wolf', 'Arcane Golem'];
    setCards(drawn);
    setOpened(true);

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { xp: increment(10) });
      for (const name of drawn) {
        await addDoc(collection(db, 'users', user.uid, 'collection'), { name });
      }
    }
  };

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
      <h2>Open Your Pack</h2>
      {!opened ? (
        <button onClick={openPack}>Open Pack</button>
      ) : (
        <div>
          {cards.map((card, idx) => (
            <div key={idx} style={{ margin: '1rem', fontSize: '1.5rem' }}>{card}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackOpen;
