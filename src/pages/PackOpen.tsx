
import React, { useEffect, useState } from 'react';
import './PackOpen.css';
import Header from '../components/Header';
import CardComponent from '../components/CardComponent';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, updateDoc, arrayUnion } from 'firebase/firestore';
import cardData from '../data/cardData.json';

interface Card {
  id: number;
  name: string;
  type: string;
  health: number;
  defense: number;
  speed: number;
  rarity: string;
  imageUrl: string;
}

function generateCards(): Card[] {
  const mythicCard: Card = {
    id: 999,
    name: 'Kaelen',
    type: 'Rogue',
    health: 20,
    defense: 1,
    speed: 5,
    rarity: 'Mythic',
    imageUrl: '/cards/ff0052ba-f417-45d0-a985-ff7635c4b2c8.png',
  };

  const cards: Card[] = [mythicCard];

  for (let i = 1; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    cards.push(cardData[randomIndex]);
  }

  return cards;
}

export default function PackOpen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const newCards = generateCards();
    setCards(newCards);

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const cardIds = newCards.map(card => card.id);
      updateDoc(userRef, {
        collection: arrayUnion(...cardIds),
      });
    }
  }, []);

  const revealCard = (index: number) => {
    if (!revealed.includes(index)) {
      setRevealed([...revealed, index]);
    }
  };

  return (
    <div className="pack-open-page">
      <Header />
      <h2 className="pack-title">You opened a pack!</h2>
      <div className="cards-container">
        {cards.map((card, index) => (
          <CardComponent
            key={index}
            card={card}
            revealed={revealed.includes(index)}
            onClick={() => revealCard(index)}
          />
        ))}
      </div>
    </div>
  );
}
