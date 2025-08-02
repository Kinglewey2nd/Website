
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data());
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-white text-center p-10">Loading profile...</div>;

  if (!profile) return <div className="text-white text-center p-10">No profile found.</div>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4 text-purple-400">Your Profile</h1>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Nickname:</strong> {profile.nickname || "(none)"}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
    </div>
  );
}
