
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function CollectionPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const ref = collection(db, "users", user.uid, "collection");
      const snapshot = await getDocs(ref);
      const fetchedCards = snapshot.docs.map(doc => doc.data());
      setCards(fetchedCards);
      setLoading(false);
    };
    fetchCards();
  }, []);

  if (loading) return <div className="text-white text-center p-10">Loading collection...</div>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-purple-300 text-center mb-8">Your Card Collection</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <div key={i} className={`bg-gray-800 rounded-lg p-3 border-l-4 rarity-${card.rarity.toLowerCase()}`}>
            <img src={card.image} alt={card.name} className="w-full rounded mb-2" />
            <h2 className="text-lg font-semibold">{card.name}</h2>
            <p className="text-sm text-gray-400">{card.rarity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
