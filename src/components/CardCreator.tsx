import React, { useState } from 'react';
import CardPreview from './CardPreview';

const CardCreator: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [attack, setAttack] = useState(0);
  const [health, setHealth] = useState(0);
  const [rarity, setRarity] = useState<'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Celestial'>('Common');
  const [imageUrl, setImageUrl] = useState('');
  const [foilImageUrl, setFoilImageUrl] = useState('');
  const [useFoil, setUseFoil] = useState(false);

  const handleRegularImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setImageUrl(fileURL);
    }
  };

  const handleFoilImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setFoilImageUrl(fileURL);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '3rem', padding: '2rem', color: 'white' }}>
      <div>
        <h2>Create a New Card</h2>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br />
        <input placeholder="Type" value={type} onChange={e => setType(e.target.value)} /><br />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /><br />
        <input type="number" placeholder="Attack" value={attack} onChange={e => setAttack(+e.target.value)} /><br />
        <input type="number" placeholder="Health" value={health} onChange={e => setHealth(+e.target.value)} /><br />
        <select value={rarity} onChange={e => setRarity(e.target.value as any)}>
          <option value="Common">🔹 Common</option>
          <option value="Uncommon">🔸 Uncommon</option>
          <option value="Rare">🔷 Rare</option>
          <option value="Epic">🟣 Epic</option>
          <option value="Legendary">🟡 Legendary</option>
          <option value="Mythic">🔥 Mythic</option>
          <option value="Celestial">🌈 Celestial</option>
        </select><br />
        <label>Upload Regular Art</label><br />
        <input type="file" onChange={handleRegularImageUpload} accept="image/*" /><br />
        <label>Upload Foil Art (.gif allowed)</label><br />
        <input type="file" onChange={handleFoilImageUpload} accept="image/*" /><br />
        <button onClick={() => setUseFoil(!useFoil)}>
          {useFoil ? 'Switch to Regular' : 'Switch to Foil'}
        </button>
      </div>

      <CardPreview
        name={name || 'Card Name'}
        type={type || 'Card Type'}
        description={description || 'Card description goes here.'}
        attack={attack}
        health={health}
        rarity={rarity}
        imageUrl={useFoil && foilImageUrl ? foilImageUrl : imageUrl}
      />
    </div>
  );
};

export default CardCreator;
