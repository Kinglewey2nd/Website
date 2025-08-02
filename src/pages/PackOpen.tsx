import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

interface Card {
  id: string;
  name: string;
  rarity: string;
}

const generateCards = (): Card[] => {
  const rarities = ['Common', 'Rare', 'Epic', 'Mythic'];
  const mythicCard: Card = {
    id: `Kaelen-${Date.now()}`,
    name: 'Kaelen',
    rarity: 'Mythic',
  };

  const cards: Card[] = [mythicCard];
  for (let i = 1; i < 5; i++) {
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    cards.push({
      id: `${rarity}-${i}-${Date.now()}`,
      name: `${rarity} Card ${i + 1}`,
      rarity,
  }
  return cards;
};
};

export default function PackOpen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);

  const openPack = () => {
    const newCards = generateCards();
    setCards(newCards);
    localStorage.setItem('spellgrave-collection', JSON.stringify([
      ...(JSON.parse(localStorage.getItem('spellgrave-collection') || '[]')),
      ...newCards
    ]));
    setRevealed([]);
  };

  const revealCard = (i: number) => {
    if (!revealed.includes(i)) {
      setRevealed([...revealed, i]);
      playSoundForRarity(cards[i].rarity);
    }
  };

  
  const playSoundForRarity = (rarity: string) => {
    const audio = new Audio(`/audio/${rarity.toLowerCase()}.mp3`);
    audio.play().catch((e) => console.error("Audio failed:", e));
  };
useEffect(() => {
    openPack();
  }, []);

  const getCardImage = (rarity: string) => {
    return `/card-art/${rarity.toLowerCase()}.png`;
  };

  return (
    <>
      <Header />
    <div style={{
      minHeight: '100vh',
      background: 'black',
      color: 'white',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Open Your Pack</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => revealCard(i)}
            style={{
              width: '140px',
              height: '200px',
              borderRadius: '12px',
              backgroundColor: '#222',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: revealed.includes(i) ? '0 0 12px gold' : '0 0 6px #444'
            }}
          >
            {revealed.includes(i) ? (
              <img
                src={getCardImage(card.rarity)}
                alt={card.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: '0.8rem', color: '#ccc' }}>Click to Reveal</span>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
