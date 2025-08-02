# Spellgrave — Dark Fantasy Card Game

Spellgrave is a collectible dark fantasy card game built with React, TypeScript, Firebase, and Vite. It includes user authentication, collectible card storage, XP progression, and animated pack opening (coming soon).

---

## 🔥 Features

### ✅ Core Gameplay
- 🔐 Email/password login and signup (Firebase Auth)
- 🎴 Open packs of 5 random cards with rarity-based RNG
- 📥 Cards are saved per user to Firestore
- 🗃 View your full collection on the `/collection` page

### 🧙 Profile & Progression
- 👤 Avatar based on email (Dicebear)
- 🧠 XP system (+10 XP per card opened)
- 📈 Leveling system (1 level per 100 XP)
- 🏅 Badges unlocked at levels 1, 5, 10+

### 🚀 Tech Stack
- React + TypeScript + Vite
- Firebase (Auth + Firestore)
- Modular component-based structure
- Fully deployable with Vercel

---

## 📍 Routes

| Path        | Page               |
|-------------|--------------------|
| `/login`    | Login              |
| `/signup`   | Create account     |
| `/collection` | View saved cards |
| `/packs`    | Open a card pack   |

---

## 🔜 Coming Soon
- 🎴 Animated card flip effects when opening packs
- 🤝 Card trading system or match-based mechanics
- 🧩 Deck builder and battle system

---

## 🛠 Setup

1. Clone the repo
2. Run `npm install`
3. Add your Firebase credentials to `src/firebase.ts`
4. Run the dev server: `npm run dev`
5. Deploy via Vercel or your preferred host