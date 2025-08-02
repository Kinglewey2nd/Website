
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const saveOpenedCards = async (userId: string, cards: any[]) => {
  const userCollection = collection(db, "users", userId, "collection");
  for (const card of cards) {
    await addDoc(userCollection, card);
  }
};
