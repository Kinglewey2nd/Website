import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import CardPreview from './CardPreview';
import { uploadCardData, updateCardData } from './firebaseUtils';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const admins = ['lwclark92@gmail.com', '', ''];

const CardCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editingCard = location.state?.card || null;
  const isAdmin = user && admins.includes(user.email || '');
  const db = getFirestore();

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
  const [saveStatus, setSaveStatus] = useState('');
  const [saving, setSaving] = useState(false);

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
    console.log('[DEBUG] Save started');

    if (!name || !attack || !health || (!imageFile && !imageUrl)) {
      console.warn('[WARN] Missing required fields');
      setSaveStatus('❌ Please complete all required fields');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    setSaving(true);
    console.log('[DEBUG] Set saving = true');

    const cardData = {
      name,
      type,
      description,
      attack: parseInt(attack),
      health: parseInt(health),
      rarity,
      imageFile,
      foilFile,
    };

    try {
      if (!editingCard) {
        console.log('[DEBUG] Checking for duplicates...');
        const q = query(collection(db, 'cards'), where('name', '==', name));
        const snapshot = await getDocs(q);
        console.log('[DEBUG] Duplicate query result:', snapshot.empty ? 'none found' : 'duplicate found');

        if (!snapshot.empty) {
          setSaveStatus('❌ A card with that name already exists');
          setSaving(false);
          setTimeout(() => setSaveStatus(''), 3000);
          return;
        }
      }

      if (editingCard?.id) {
        console.log('[DEBUG] Updating existing card...');
        await updateCardData(editingCard.id, cardData);
        setSaveStatus('✅ Card updated!');
      } else {
        console.log('[DEBUG] Uploading new card...');
        await uploadCardData(cardData);
        setSaveStatus('✅ Card created!');

        // Reset form
        setName('');
        setType('');
        setDescription('');
        setAttack('');
        setHealth('');
        setRarity('Common');
        setImageFile(null);
        setFoilFile(null);
        setImageUrl('');
        setFoilImageUrl('');
        setUseFoil(false);
      }

      console.log('[DEBUG] Save complete');

      setTimeout(() => {
        setSaveStatus('');
        navigate('/cards');
      }, 1500);
    } catch (error) {
      console.error('[ERROR] Save failed:', error);
      setSaveStatus('❌ Failed to save card');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setSaving(false);
      console.log('[DEBUG] Save flow ended');
    }
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
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : `💾 ${editingCard ? 'Update' : 'Save'} Card`}
        </button>

        {saveStatus && (
          <div style={{ marginTop: '1rem', color: saveStatus.startsWith('✅') ? 'lightgreen' : 'red' }}>
            {saveStatus}
          </div>
        )}
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
