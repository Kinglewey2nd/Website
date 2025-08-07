import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../useAuth";

const admins = [
  "lwclark92@gmail.com",
  "neetinegi.codedrill@gmail.com",
  "dratidz@gmail.com",
  "karan@codedrillinfotech.com"
];

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user && admins.includes(user.email || "");

  const handleLogout = async () => {
    await signOut(getAuth());
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        color: "white",
        fontFamily: "Cinzel, serif",
      }}
    >
      {/* Main Area */}
      <div style={{ flex: 1, textAlign: "center", paddingTop: "8rem" }}>
        <h1 style={{ fontSize: "3rem" }}>🧙‍♂️ SpellGrave</h1>
        <button onClick={() => navigate("/pack/open")} style={buttonStyle}>
          🎴 Open a Pack
        </button>
        <br />
        <button onClick={() => navigate("/collection")} style={buttonStyle}>
          📚 View Collection
        </button>
        <br />
        <button onClick={() => navigate("/profile")} style={buttonStyle}>
          👤 Profile
        </button>
        <br />
        <button
          onClick={handleLogout}
          style={{ ...buttonStyle, marginTop: "2rem", backgroundColor: "#511" }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Admin Bar */}
      {isAdmin && (
        <div
          style={{
            width: "280px",
            backgroundColor: "#222",
            padding: "2rem",
            borderLeft: "2px solid #555",
          }}
        >
          <h2
            style={{ borderBottom: "1px solid #444", paddingBottom: "0.5rem" }}
          >
            🛠️ Admin
          </h2>
          <button
            onClick={() => navigate("/view-cards")}
            style={adminButtonStyle}
          >
            View Card
          </button>
          <button
            onClick={() => navigate("/card-creator")}
            style={adminButtonStyle}
          >
            ➕ Card Creator
          </button>
          <button
            onClick={() => navigate("/create-collection")}
            style={adminButtonStyle}
          >
            ➕ Create Collection
          </button>
          <button
            onClick={() => navigate("/create-rarity-gem")}
            style={adminButtonStyle}
          >
            ➕ Create Rarity gem
          </button>
          <br />
          <button
            onClick={() => navigate("/card-editor")}
            style={adminButtonStyle}
          >
            📝 Card Editor
          </button>
        </div>
      )}
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  margin: "1rem auto",
  padding: "1rem 1rem",
  fontSize: "1.2rem",
  backgroundColor: "#333",
  color: "white",
  border: "1px solid #888",
  borderRadius: "8px",
  cursor: "pointer",
};

const adminButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  width: "100%",
  margin: "0.5rem 0",
  backgroundColor: "#444",
};

export default MainMenu;
