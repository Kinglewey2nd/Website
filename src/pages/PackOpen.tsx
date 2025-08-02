import React, { useEffect, useState } from 'react';

interface Card {
  id: string;
  name: string;
  rarity: string;
}

const generateCards = (): Card[] => {
  const rarities = ['Common', 'Rare', 'Epic', 'Mythic'];
  return Array.from({ length: 5 }, (_, i) => {
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    return {
      id: `${rarity}-${i}-${Date.now()}`,
      name: `${rarity} Card ${i + 1}`,
      rarity
    };
  });
};

export default function PackOpen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);

  const openPack = () => {
    setCards(generateCards());
    setRevealed([]);
  };

  const revealCard = (i: number) => {
    if (!revealed.includes(i)) {
      setRevealed([...revealed, i]);
    }
  };

  useEffect(() => {
    openPack();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Open Your Pack</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => revealCard(i)}
            style={{
              width: "120px",
              height: "180px",
              backgroundColor: "#111",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "0.8rem",
              cursor: "pointer",
              border: "2px solid #444",
              transition: "all 0.3s ease",
            }}
          >
            {revealed.includes(i) ? card.name : "Click to Reveal"}
          </div>
        ))}
      </div>
      <button onClick={openPack} style={{ marginTop: "2rem", padding: "0.6rem 1.2rem", fontSize: "1rem" }}>
        Open Another Pack
      </button>
    </div>
  );
}
