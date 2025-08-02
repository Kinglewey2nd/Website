import React from 'react';
import Header from '../components/Header';
import { useEffect, useState } from 'react';

interface Card {
  id: string;
  name: string;
  rarity: string;
}

}
export default function Collection() {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);

  useEffect(() => {
    // Load cards from localStorage or mock collection for now
    const saved = localStorage.getItem('spellgrave-collection');
    if (saved) {
      setOwnedCards(JSON.parse(saved));
    } else {
      setOwnedCards([]);
    }
  }, []);

  const getCardImage = (rarity: string, name: string) => {
    if (name === 'Kaelen') return '/card-art/kaelen.png';
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
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Collection</h2>
      {ownedCards.length === 0 ? (
        <p>You haven't collected any cards yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {ownedCards.map((card, index) => (
            <div key={index} style={{
              width: '140px',
              height: '200px',
              backgroundColor: '#222',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 0 8px #666'
            }}>
              <img
                src={getCardImage(card.rarity, card.name)}
                alt={card.name}
                title={card.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}