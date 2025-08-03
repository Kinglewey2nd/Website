import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from './firebase';

const storage = getStorage(app);
const db = getFirestore(app);

export const uploadCardData = async ({
  name, type, description, attack, health, rarity,
  imageFile, foilFile
}: {
  name: string;
  type: string;
  description: string;
  attack: number;
  health: number;
  rarity: string;
  imageFile: File;
  foilFile?: File | null;
}) => {
  const cardRef = ref(storage, `cards/${Date.now()}_${imageFile.name}`);
  const imageSnapshot = await uploadBytes(cardRef, imageFile);
  const imageUrl = await getDownloadURL(imageSnapshot.ref);

  let foilUrl = '';
  if (foilFile) {
    const foilRef = ref(storage, `cards/foil_${Date.now()}_${foilFile.name}`);
    const foilSnapshot = await uploadBytes(foilRef, foilFile);
    foilUrl = await getDownloadURL(foilSnapshot.ref);
  }

  await addDoc(collection(db, 'cards'), {
    name, type, description, attack, health, rarity,
    imageUrl, foilUrl,
    createdAt: Timestamp.now()
  });
};
