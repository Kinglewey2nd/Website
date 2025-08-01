import React, { useEffect, useState } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import CardDisplay from '../components/CardDisplay';
import UserProfile from '../components/UserProfile';
import { collection, getDocs } from 'firebase/firestore';

const Collection: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollection = async (uid: string) => {
    const snapshot = await getDocs(collection(db, 'users', uid, 'collection'));
    const userCards = snapshot.docs.map((doc) => doc.data());
    setCards(userCards);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCollection(user.uid);
      } else {
        window.location.href = '/login';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <UserProfile />
      <h2>Your Card Collection</h2>
      {loading ? (
        <p>Loading cards...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {cards.map((card, index) => (
            <CardDisplay key={index} {...card} />
          ))}
        </div>
      )}
      <button onClick={handleLogout} style={{ marginTop: '2rem', padding: '0.75rem' }}>
        Logout
      </button>
    </div>
  );
};

export default Collection;