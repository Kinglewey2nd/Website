// src/components/PackOpen.tsx
import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

const cards = [
  { name: 'Inferno Dragon', image: '/cards/inferno-dragon.png' },
  { name: 'Shadow Mage', image: '/cards/shadow-mage.png' },
  { name: 'Storm Beast', image: '/cards/storm-beast.png' },
  { name: 'Nature Dryad', image: '/cards/nature-dryad.png' },
  { name: 'Void Reaper', image: '/cards/void-reaper.png' }
];

const PackOpen: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const [flipped, setFlipped] = useState(Array(cards.length).fill(false));
  const [loading, setLoading] = useState(false);
  const auth = getAu
