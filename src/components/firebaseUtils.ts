import { getFirestore, collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

/**
 * Adds a new card to Firestore using pre-uploaded image URLs.
 */
export const uploadCardData = async ({
  name,
  type,
  description,
  attack,
  health,
  rarity,
  imageUrl,
  foilUrl,
}: {
  name: string;
  type: string;
  description: string;
  attack: number;
  health: number;
  rarity: string;
  imageUrl: string;
  foilUrl?: string;
}) => {
  await addDoc(collection(db, 'cards'), {
    name,
    type,
    description,
    attack,
    health,
    rarity,
    imageUrl,
    foilUrl: foilUrl || '',
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
