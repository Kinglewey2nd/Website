import React from 'react';
import './CardPreview.css';

type Rarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Legendary'
  | 'Mythic'
  | 'Celestial';

interface CardPreviewProps {
  name: string;
  type: string;
  description: string;
  attack: number;
  health: number;
  rarity: Rarity;
  imageUrl: string;
}

const rarityStyles: Record<Rarity, { icon: string; border: string }> = {
  Common:     { icon: '🔹', border: 'gray-border' },
  Uncommon:   { icon: '🔸', border: 'green-border' },
  Rare:       { icon: '🔷', border: 'blue-border' },
  Epic:       { icon: '🟣', border: 'purple-border' },
  Legendary:  { icon: '🟡', border: 'gold-border' },
  Mythic:     { icon: '🔥', border: 'red-border' },
  Celestial:  { icon: '🌈', border: 'rainbow-border' },
};

const CardPreview: React.FC<CardPreviewProps> = ({
  name,
  type,
  description,
  attack,
  health,
  rarity,
  imageUrl,
}) => {
  const { icon, border } = rarityStyles[rarity];

  return (
    <div className={`card-preview ${border}`}>
      <div className="image-section">
        <img src={imageUrl} alt={name} />
        <div className="rarity-icon">{icon}</div>
      </div>
      <div className="card-body">
        <h3 className="card-name">{name}</h3>
        <p className="card-type">{type}</p>
        <p className="card-desc">{description}</p>
        <div className="card-stats">
          <span className="attack">{attack}</span>
          <span className="health">{health}</span>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
