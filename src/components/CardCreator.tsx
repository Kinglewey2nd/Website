// src/components/CardCreator.tsx
import React, { useState } from 'react';
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

    try {
      setStatus('⏳ Requesting signed upload URL...');
      const res = await fetch(
        'https://us-central1-spellgrave-f2e30.cloudfunctions.net/getSignedUploadUrl',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: `${Date.now()}_${file.name.replace(/[^\w.-]/g, '_')}`,
            contentType: file.type,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');

      console.log('✅ Got signed URL:', data.url);
      setStatus('⬆️ Uploading to signed URL...');

      const uploadRes = await fetch(data.url, {
        method: 'PUT',
        mode: 'cors', // ✅ Explicitly use CORS
        headers: {
          'Content-Type': file.type, // ✅ Must match what was passed in POST
        },
        body: file,
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text(); // ✅ Helpful debug info
        throw new Error(`Upload failed. Status: ${uploadRes.status} – ${errorText}`);
      }

      setStatus('✅ Upload successful! Image is now in Firebase Storage.');
      console.log('✅ Upload complete:', data.url);
    } catch (err: any) {
      console.error('❌ Upload error:', err);
      setStatus(`❌ Upload failed: ${err.message || err}`);
    }
  };

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2>🧪 Card Image Upload</h2>
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
