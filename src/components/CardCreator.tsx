import React, { useState } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';

const CardCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

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
      setStatus('❌ You must be logged in to upload.');
      return;
    }

    if (!file) {
      setStatus('❌ No file selected.');
      return;
    }

    setStatus('⏳ Uploading...');
    const fileName = encodeURIComponent(`cards/${Date.now()}_${file.name}`);
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/spellgrave-f2e30.appspot.com/o?name=${fileName}`;

    try {
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!res.ok) throw new Error(`Upload failed. HTTP ${res.status}`);
      const result = await res.json();

      const token = result.downloadTokens;
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/spellgrave-f2e30.appspot.com/o/${fileName}?alt=media&token=${token}`;

      console.log('✅ File uploaded:', publicUrl);
      setDownloadUrl(publicUrl);
      setStatus('✅ Upload successful!');
    } catch (err) {
      console.error('❌ Upload error:', err);
      setStatus('❌ Upload failed. See console for details.');
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem', color: 'white' }}>
        <h2>⚠️ You must be logged in</h2>
        <p>Please <a href="/login" style={{ color: '#00f' }}>login</a> to upload a card.</p>
        <button onClick={() => navigate('/menu')} style={{ marginTop: '1rem' }}>Back to Menu</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2>🧪 Card Creator (CORS-Safe Upload)</h2>
      <input type="file" accept="image/*" onChange={handleSelect} /><br /><br />
      {preview && (
        <img src={preview} alt="preview" style={{ width: 200, border: '1px solid white' }} />
      )}
      <br /><br />
      <button onClick={handleUpload} disabled={!file}>Upload Image</button>
      <p>{status}</p>
      {downloadUrl && (
        <div>
          <p>✅ Uploaded Image URL:</p>
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0af' }}>
            {downloadUrl}
          </a>
        </div>
      )}
      <button onClick={() => navigate('/menu')} style={{ marginTop: '1rem' }}>Back to Menu</button>
    </div>
  );
};

export default CardCreator;
