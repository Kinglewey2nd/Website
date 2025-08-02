
import React, { useEffect, useState } from "react";
import "@/styles/animations.css";
import { generateCardPack } from "@/utils/cardGeneration";
import { saveOpenedCards } from "@/firebase/firestore";

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
    <div className="pack-opening-container text-white text-center">
      <h1 className="text-3xl mb-6">Pack Opening</h1>
      <div className="card-grid flex justify-center gap-4 flex-wrap">
        {cards.map((card, i) => (
          <div
            key={i}
            className={\`card-flip \${revealed.includes(i) ? "revealed" : ""} rarity-\${card.rarity.toLowerCase()}\`}
            onClick={() => revealCard(i)}
          >
            <div className="card-inner">
              <div className="card-front"></div>
              <div className="card-back">
                <img src={card.image} alt={card.name} className="w-full rounded" />
                <p>{card.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {revealed.length < 5 ? (
        <button onClick={revealAll} className="mt-6 btn bg-blue-500 text-white px-4 py-2 rounded">
          Reveal All
        </button>
      ) : (
        <button onClick={handleSave} className="mt-6 btn bg-green-500 text-white px-4 py-2 rounded">
          Add to Collection
        </button>
      )}
    </div>
  );
}
