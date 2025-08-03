import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { app } from '../firebase'; // Adjust this path if needed

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
  const cardRef = ref(storage, `cards/${timestamp}_${imageFile.name}`);
  const imageSnapshot = await uploadBytes(cardRef, imageFile);
  const imageUrl = await getDownloadURL(imageSnapshot.ref);

  let foilUrl = '';
  if (foilFile) {
    const foilRef = ref(storage, `cards/foil_${timestamp}_${foilFile.name}`);
    const foilSnapshot = await uploadBytes(foilRef, foilFile);
    foilUrl = await getDownloadURL(foilSnapshot.ref);
  }

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

/**
 * Updates an existing card document by ID.
 */
export const updateCardData = async (
  cardId: string,
  updatedFields: Partial<{
    name: string;
    type: string;
    description: string;
    attack: number;
    health: number;
    rarity: string;
    imageUrl: string;
    foilUrl: string;
  }>
) => {
  const cardDoc = doc(db, 'cards', cardId);
  await updateDoc(cardDoc, {
    ...updatedFields,
    updatedAt: Timestamp.now(),
  });
};
