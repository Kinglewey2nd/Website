// src/components/CardCreator.tsx
import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';

const CardCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState('');

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
      console.log('📸 Selected file:', selected.name);
      console.log('🧾 File type:', selected.type);
      console.log('📦 File size:', selected.size);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      setStatus('❌ Must be logged in to upload.');
      return;
    }

    if (!file) {
      setStatus('❌ No file selected.');
      return;
    }

    setStatus('⏳ Uploading...');
    const storage = getStorage(app);
    const cleanName = file.name.replace(/[^\w.-]/g, '_');
    const storageRef = ref(storage, `cards/${Date.now()}_${cleanName}`);

    try {
      console.log('📤 Uploading file via Firebase SDK:', file.name);
      const snap = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snap.ref);
      console.log('✅ File uploaded. URL:', url);
      setStatus(`✅ Upload successful! URL: ${url}`);
    } catch (err) {
      console.error('❌ Upload error:', err);
      setStatus('❌ Upload failed. See console for details.');
    }
  };

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2>🧪 Image Upload Debug</h2>
      <input type="file" accept="image/*" onChange={handleSelect} /><br /><br />
      {preview && (
        <img src={preview} alt="preview" style={{ width: 200, border: '1px solid white' }} />
      )}
      <br /><br />
      <button onClick={handleUpload} disabled={!file}>Upload Image</button>
      <p>{status}</p>
      <button onClick={() => navigate('/menu')} style={{ marginTop: '1rem' }}>Back to Menu</button>
    </div>
  );
};

export default CardCreator;
