import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

interface Card {
  id: string;
  name: string;
  rarity: string;
}

const STORAGE_KEY = 'spellgrave-collection';

const rarityColors: Record<string, string> = {
  Common: '#888',
  Rare: '#0066cc',
  Epic: '#8e44ad',
  Mythic: 'gold',
};

const generateCards = (): Card[] => {
  const rarities = ['Common', 'Rare', 'Epic', 'Mythic'];
  const mythicCard: Card = {
    id: `Kaelen-${Date.now()}`,
    name: 'Kaelen',
    rarity: 'Mythic'
  };

  const cards: Card[] = [mythicCard];
  const timestamp = Date.now();

  for (let i = 1; i < 5; i++) {
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    cards.push({
      id: `${rarity}-${i}-${timestamp}`,
      name: `${rarity} Card ${i + 1}`,
      rarity
    });
  }

  return cards;
};

}
export default function PackOpen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);

  const openPack = () => {
    const newCards = generateCards();
    setCards(newCards);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([
      ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')),
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
    audio.volume = 0.5;
    audio.play().catch(console.error);
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
        <button onClick={openPack} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' }}>
          Open New Pack
        </button>
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
                border: `2px solid ${rarityColors[card.rarity] || '#444'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: revealed.includes(i) ? '0 0 12px gold' : '0 0 6px #444',
                transition: 'transform 0.5s, opacity 0.5s',
                transform: revealed.includes(i) ? 'rotateY(0)' : 'rotateY(180deg)',
                opacity: revealed.includes(i) ? 1 : 0.7
              }}
            >
              {revealed.includes(i) ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img
                    src={getCardImage(card.rarity)}
                    onError={(e) => (e.currentTarget.src = "/card-art/default.png")}
                    alt={card.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    fontSize: '0.8rem',
                    padding: '0.25rem',
                    textShadow: '1px 1px black'
                  }}>
                    {card.name} ({card.rarity})
                  </div>
                </div>
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