
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ xp: 0, level: 1, badges: [] });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);

      const fetchUserData = async () => {
        const ref = doc(db, "users", parsed.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const xp = data.xp || 0;
          const nickname = data.nickname || "";
          setNickname(nickname);
          const level = Math.floor(xp / 100) + 1;
          const badges = data.badges || [];
          setUserData({ xp, level, badges });
        }
      };

      fetchUserData();
    }
  }, []);

  if (!user) return <div className="text-white p-4">Loading profile...</div>;

  return (
    <div className="text-white p-6 max-w-xl mx-auto bg-black bg-opacity-60 rounded-lg">
      <div className="flex items-center gap-4 mb-6">
        <img src={user.photoURL} alt="Avatar" className="w-20 h-20 rounded-full" />
        <div>
          <h2 className="text-2xl font-bold">{user.displayName || user.email}</h2>
          <p>Email: {user.email}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Level: {userData.level}</h3>
        <div className="w-full bg-gray-700 rounded h-4 mt-1">
          <div
            className="bg-green-500 h-4 rounded"
            style={{ width: `${(userData.xp % 100)}%` }}
          />
        </div>
        <p className="text-sm mt-1">{userData.xp % 100} XP until next level</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Badges</h3>
        {userData.badges.length > 0 ? (
          <ul className="list-disc list-inside">
            {userData.badges.map((badge, i) => (
              <li key={i}>{badge}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No badges yet.</p>
        )}
      </div>
    </div>
  );
}
