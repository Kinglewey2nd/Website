
import React, { useEffect, useState } from "react";
import "@/styles/animations.css";
import { generateCardPack } from "@/utils/cardGeneration";
import { saveOpenedCards } from "@/firebase/firestore";
import { Link } from "react-router-dom";

export default function PackOpening({ userId = "demo-user", onFinish = () => {} }) {
  const [cards, setCards] = useState<any[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);

  useEffect(() => {
    const pack = generateCardPack();
    setCards(pack);
  }, []);

  const revealCard = (index: number) => {
    if (!revealed.includes(index)) {
      setRevealed([...revealed, index]);
    }
  };

  const revealAll = () => {
    setRevealed([0, 1, 2, 3, 4]);
  };

  const handleSave = async () => {
    await saveOpenedCards(userId, cards);
    onFinish();
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen px-4 py-12 text-white">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-300 drop-shadow-lg">Open Your Pack</h1>
      <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`card-flip ${revealed.includes(i) ? "revealed" : ""} rarity-${card.rarity.toLowerCase()}`}
            onClick={() => revealCard(i)}
            style={{ transitionDelay: `${i * 0.2}s` }}
          >
            <div className="card-inner">
              <div className="card-front" />
              <div className="card-back">
                <img src={card.image} alt={card.name} className="w-full rounded shadow-lg" />
                <p className="mt-2 font-semibold">{card.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        {revealed.length < 5 ? (
          <button onClick={revealAll} className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full text-lg shadow-md transition">
            Reveal All
          </button>
        ) : (
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full text-lg shadow-md transition">
            Add to Collection
          </button>
        )}
        <div className="mt-6">
          <Link to="/pack" className="text-sm text-purple-400 hover:text-purple-300 underline">
            ← Back to Pack Page
          </Link>
        </div>
      </div>
    </div>
  );
}
