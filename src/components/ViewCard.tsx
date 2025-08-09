import React from 'react';
import { useNavigate } from 'react-router-dom';

const cardData = [
  {
    id: '1',
    image: 'https://picsum.photos/200/300',
    rarityImage: 'https://picsum.photos/30',
    name: 'Dragon Slayer',
    description: 'A powerful card that defeats dragons.',
    creature: 'Warrior',
  },
  {
    id: '2',
    image: 'https://picsum.photos/200/300?2',
    rarityImage: 'https://picsum.photos/30?2',
    name: 'Frost Giant',
    description: 'Freezes enemies with ice.',
    creature: 'Giant',
  },
  // ... more cards
];

type Card = {
  id: string;
  image: string;
  rarityImage: string;
  name: string;
  description: string;
  creature: string;
};

const ViewCard = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      {/* Back to Menu */}
      <button
        className="text-sm bg-gray-200 px-3 py-1 rounded shadow mb-6"
        onClick={() => {
          navigate(-1);
        }}
      >
        ← Back to Menu
      </button>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cardData.map(card => (
          <div
            key={card.id}
            className="border rounded-lg shadow-sm p-4 bg-white flex flex-col gap-2"
          >
            {/* Card Image */}
            <img
              src={card.image}
              alt="Card"
              className="w-full h-40 object-cover border"
            />

            {/* Rarity Image */}
            <img
              src={card.rarityImage}
              alt="Rarity"
              className="w-10 h-10 self-start"
            />

            {/* Card Info */}
            <div>
              <h2 className="font-bold text-md">{card.name}</h2>
              <p className="text-sm text-gray-600">{card.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Creature: {card.creature}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={id => alert(`Edit ${id}`)}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={id => alert(`Delete ${id}`)}
                className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCard;
