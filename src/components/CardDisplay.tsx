import React from 'react';

interface CardProps {
  name: string;
  rarity: string;
  image: string;
}

const CardDisplay: React.FC<CardProps> = ({ name, rarity, image }) => {
  return (
    <div style={{
      border: '2px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center',
      backgroundColor: rarity === 'Mythic' ? '#ffeaa7' : '#f0f0f0'
    }}>
      <img src={image} alt={name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
      <h4>{name}</h4>
      <p>{rarity}</p>
    </div>
  );
};

export default CardDisplay;