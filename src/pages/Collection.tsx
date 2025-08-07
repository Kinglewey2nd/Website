import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

interface Card {
  id: string;
  name: string;
  rarity: string;
}

export default function Collection() {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('spellgrave-collection');
    if (saved) {
      setOwnedCards(JSON.parse(saved));
    }
  }, []);

  const getCardImage = (rarity: string) => {
    return `/card-art/${rarity.toLowerCase()}.png`;
  };

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: '100vh',
          background: 'black',
          color: 'white',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          My Collection
        </h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          {ownedCards.map((card, i) => (
            <div
              key={i}
              style={{
                width: '140px',
                height: '200px',
                borderRadius: '12px',
                backgroundColor: '#222',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: `2px solid ${
                  card.rarity === 'Mythic'
                    ? 'purple'
                    : card.rarity === 'Epic'
                      ? 'orange'
                      : card.rarity === 'Rare'
                        ? 'blue'
                        : 'gray'
                }`,
              }}
            >
              <img
                src={getCardImage(card.rarity)}
                alt={card.name}
                style={{ width: '100%', height: '80%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {card.name} ({card.rarity})
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
