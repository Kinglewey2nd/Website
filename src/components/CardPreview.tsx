// src/pages/PreviewPage.tsx
import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import CardPreview from '../components/CardPreview';

const storage = getStorage(app);

const PreviewPage: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const cardsFolderRef = ref(storage, 'cards'); // this matches the folder used in your upload
        const result = await listAll(cardsFolderRef);
        const urls = await Promise.all(result.items.map(item => getDownloadURL(item)));
        setImageUrls(urls);
      } catch (error) {
        console.error('❌ Failed to list card images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div style={{ padding: '3rem', color: 'white' }}>
      <h1 style={{ textAlign: 'center' }}>🖼️ All Uploaded Cards</h1>
      {loading && <p>Loading cards from Firebase Storage...</p>}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1.5rem',
      }}>
        {imageUrls.map((url, i) => (
          <CardPreview
            key={i}
            name={`Card ${i + 1}`}
            type="Creature"
            description="A mysterious uploaded card."
            attack={0}
            health={0}
            rarity="Common" // placeholder for now — upgrade later with Firestore metadata
            imageUrl={url}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewPage;
