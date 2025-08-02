import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '../firebase';
import { Card } from '../types';

const STORAGE_KEY = 'spellgrave-collection';

const rarityColors: Record<string, string> = {
  Common: '#bbb',
  Rare: '#1e90ff',
  Epic: '#9932cc',
  Legendary: '#ffa500',
  Mythic: '#ff4444',
};

export default function PackOpen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const openPack = async () => {
    setLoading(true);
    const res = await fetch('/api/open-pack');
    const newCards: Card[] = await res.json();
    setCards(newCards);
    setRevealed(new Array(newCards.length).fill(false));
    setLoading(false);

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      const prevCollection = docSnap.exists() ? docSnap.data().collection || [] : [];
      const updatedCollection = [...prevCollection, ...newCards];
      await setDoc(userRef, { collection: updatedCollection }, { merge: true });
    }
  };

  useEffect(() => {
    openPack();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Your Pack</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="w-40 h-64 bg-gray-900 rounded-lg shadow-lg cursor-pointer relative overflow-hidden"
            style={{ border: `2px solid ${rarityColors[card.rarity] || '#fff'}` }}
            onClick={() =>
              setRevealed((prev) => {
                const updated = [...prev];
                updated[i] = true;
                return updated;
              })
            }
          >
            {revealed[i] ? (
              <div className="p-4 text-center">
                <h2 className="text-xl font-bold">{card.name}</h2>
                <p className="text-sm">{card.rarity}</p>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-lg">Click to Reveal</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={openPack}
        className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-semibold"
      >
        Open New Pack
      </button>
    </div>
  );
}
