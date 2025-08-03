import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../firebase'; // ✅ corrected path

const storage = getStorage(app);
const db = getFirestore(app);

/**
 * Uploads a new card with image and optional foil to Firestore and Firebase Storage.
 */
export const uploadCardData = async ({
  name,
  type,
  description,
  attack,
  health,
  rarity,
  imageFile,
  foilFile,
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
  const timestamp = Date.now();

  // Upload main image
  const cardRef = ref(storage, `cards/${timestamp}_${imageFile.name}`);
  const imageSnapshot = await uploadBytes(cardRef, imageFile);
  const imageUrl = await getDownloadURL(imageSnapshot.ref);

  // Upload foil image if provided
  let foilUrl = '';
  if (foilFile) {
    const foilRef = ref(storage, `cards/foil_${timestamp}_${foilFile.name}`);
    const foilSnapshot = await uploadBytes(foilRef, foilFile);
    foilUrl = await getDownloadURL(foilSnapshot.ref);
  }

  // Save card data to Firestore
  await addDoc(collection(db, 'cards'), {
    name,
    type,
    description,
    attack,
    health,
    rarity,
    imageUrl,
    foilUrl,
    createdAt: Timestamp.now(),
  });
};
