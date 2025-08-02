
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Collection: React.FC = () => {
  const [cards, setCards] = useState<string[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCards = async () => {
      if (user) {
        const colRef = collection(db, 'users', user.uid, 'collection');
        const snapshot = await getDocs(colRef);
        const names = snapshot.docs.map(doc => doc.data().name);
        setCards(names);
      }
    };
    fetchCards();
  }, [user]);

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
      <h2>Your Collection</h2>
      {cards.map((card, idx) => (
        <div key={idx}>{card}</div>
      ))}
    </div>
  );
};

<button onClick={() => navigate('/menu')} className="back-button">
  Back to Menu
</button>


export default Collection;
