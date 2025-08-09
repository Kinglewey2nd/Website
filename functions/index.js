import { https } from 'firebase-functions';
import { getStorage } from 'firebase-admin/storage';
import  admin  from 'firebase-admin';
import multer from 'multer';
import cors from 'cors';
import path from 'path';

admin.initializeApp();

// Multer config to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });
const bucket = getStorage().bucket('spellgrave-f2e30.appspot.com');

export const getImageUrl = https.onRequest((req, res) => {
  cors({ origin: true })(req, res, async () => {
    if (req.method === 'OPTIONS') {
      return res.status(204).send('');
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Multer middleware to parse form-data
    upload.single('gemImage')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        const fileName = `${Date.now()}_${req.file.originalname}`;
        const file = bucket.file(`cards/${fileName}`);

        // Upload buffer to GCS 
        await file.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
          public: true,
        });

        // Make file public
        await file.makePublic();

        // Public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/cards/${fileName}`;

        return res.status(200).json({ url: publicUrl });
      } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    });
  });
});
