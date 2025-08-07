import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset email sent!");
    } catch (error) {
      alert("Reset failed: " + (error as any).message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Reset Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleReset}>Send Reset Email</button>
    </div>
  );
};

export default ResetPassword;
