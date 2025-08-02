import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDOMBhE3JTlh3fLEC98nXy0YWtsc2cpFAE",
  authDomain: "spellgrave-f2e30.firebaseapp.com",
  projectId: "spellgrave-f2e30",
  storageBucket: "spellgrave-f2e30.appspot.com",
  messagingSenderId: "387513452186",
  appId: "1:387513452186:web:a049bac189f315b4088123",
  measurementId: "G-FKXDG97B9Y"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// ✅ Create context (initially undefined to prevent unsafe usage)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Provide auth state to children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook to access auth context safely
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
