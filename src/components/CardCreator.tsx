import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import CardPreview from './CardPreview';
import { uploadCardData, updateCardData } from './firebaseUtils';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';

const admins = ['lwclark92@gmail.com', '', ''];

const sanitizeFileName = (name: string) => name.replace(/[^\w.-]/g, '_');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
  const [useFoil, setUseFoil] = useState(false);

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [foilPreviewUrl, setFoilPreviewUrl] = useState('');

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
      setImagePreviewUrl(editingCard.imageUrl || '');
      setFoilPreviewUrl(editingCard.foilUrl || '');
    }
  }, [editingCard]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert('Regular image is too large. Max size is 10MB.');
        return;
      }
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFoilSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert('Foil image is too large. Max size is 10MB.');
        return;
      }
      setFoilFile(file);
      setFoilPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!user) {
      setSaveStatus('❌ You must be logged in to upload');
      return;
    }

    if (!name || !attack || !health) {
      setSaveStatus('❌ Please fill in required fields');
      return;
    }

    setSaving(true);
    setSaveStatus('');

    try {
      const storage = getStorage(app);
      let imageUrl = imagePreviewUrl;
      let foilUrl = foilPreviewUrl;

      if (imageFile && imageFile.size > 0) {
        const cleanName = sanitizeFileName(imageFile.name);
        const imageRef = ref(storage, `cards/${Date.now()}_${cleanName}`);
        const snap = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snap.ref);
      }

      if (foilFile && foilFile.size > 0) {
        const cleanName = sanitizeFileName(foilFile.name);
        const foilRef = ref(storage, `cards/${Date.now()}_${cleanName}`);
        const snap = await uploadBytes(foilRef, foilFile);
        foilUrl = await getDownloadURL(snap.ref);
      }

      const cardData = {
        name,
        type,
        description,
        attack: parseInt(attack),
        health: parseInt(health),
        rarity,
        imageUrl,
        foilUrl,
      };

      if (!editingCard) {
        const q = query(collection(db, 'cards'), where('name', '==', name));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setSaveStatus('❌ A card with that name already exists');
          setSaving(false);
          return;
        }
      }

      if (editingCard?.id) {
        await updateCardData(editingCard.id, cardData);
        setSaveStatus('✅ Card updated!');
      } else {
        await uploadCardData(cardData);
        setSaveStatus('✅ Card created!');
        setName('');
        setType('');
        setDescription('');
        setAttack('');
        setHealth('');
        setRarity('Common');
        setImageFile(null);
        setFoilFile(null);
        setImagePreviewUrl('');
        setFoilPreviewUrl('');
        setUseFoil(false);
      }

      setTimeout(() => {
        setSaveStatus('');
        navigate('/cards');
      }, 1500);
    } catch (err) {
      console.error('Upload failed:', err);
      setSaveStatus('❌ Upload failed — check your image files and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
        <h2>🚫 Access Denied</h2>
        <p>This page is for admin users only.</p>
      </div>
    );
  }

  const shouldRenderImage = useFoil
    ? foilPreviewUrl && foilFile
    : imagePreviewUrl && imageFile;

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
        </select><br /><br />

        <label>Upload Regular Image</label><br />
        <input type="file" accept="image/*" onChange={handleImageSelect} /><br />
        <label>Upload Foil Image (Optional)</label><br />
        <input type="file" accept="image/*" onChange={handleFoilSelect} /><br />
        <button onClick={() => setUseFoil(!useFoil)}>
          {useFoil ? 'Use Regular Art' : 'Use Foil Art'}
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
        imageUrl={shouldRenderImage ? (useFoil ? foilPreviewUrl : imagePreviewUrl) : ''}
      />
    </div>
  );
};

export default CardCreator;
