import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import CardPreview from './CardPreview';
import { uploadCardData, updateCardData } from './firebaseUtils';

const admins = ['lwclark92@gmail.com', 'admin@spellgrave.com', 'lewis@spellgrave.com'];
const CardCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editingCard = location.state?.card || null;

  const isAdmin = user && admins.includes(user.email || '');

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [attack, setAttack] = useState('');
  const [health, setHealth] = useState('');
  const [rarity, setRarity] = useState<'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Celestial'>('Common');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [foilFile, setFoilFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [foilImageUrl, setFoilImageUrl] = useState('');
  const [useFoil, setUseFoil] = useState(false);

  useEffect(() => {
    if (editingCard) {
      setName(editingCard.name);
      setType(editingCard.type);
      setDescription(editingCard.description);
      setAttack(editingCard.attack.toString());
      setHealth(editingCard.health.toString());
      setRarity(editingCard.rarity);
      setImageUrl(editingCard.imageUrl);
      setFoilImageUrl(editingCard.foilUrl || '');
    }
  }, [editingCard]);

  const handleRegularImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleFoilImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFoilFile(e.target.files[0]);
      setFoilImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    if (!name || !attack || !health || !imageUrl) return alert('Fill out required fields');

    const data = {
      name,
      type,
      description,
      attack: +attack,
      health: +health,
      rarity,
      imageFile,
      foilFile,
      imageUrl,
      foilUrl: foilImageUrl,
    };

    if (editingCard) {
      await updateCardData(editingCard.id, data);
      alert('Card updated!');
    } else {
      await uploadCardData(data);
      alert('Card created!');
    }

    navigate('/cards');
  };

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', color: 'white', marginTop: '5rem' }}>
        <h2>🚫 Access Denied</h2>
        <p>This page is for admin use only.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '3rem', padding: '2rem', color: 'white' }}>
      <div>
        <h2>{editingCard ? 'Edit Card' : 'Create a New Card'}</h2>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br />
        <input placeholder="Type" value={type} onChange={e => setType(e.target.value)} /><br />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /><br />
        <input type="number" placeholder="Attack" value={attack} onChange={e => setAttack(e.target.value)} /><br />
        <input type="number" placeholder="Health" value={health} onChange={e => setHealth(e.target.value)} /><br />
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
        </button><br /><br />
        <button onClick={handleSave}>💾 {editingCard ? 'Update' : 'Save'} Card</button>
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
