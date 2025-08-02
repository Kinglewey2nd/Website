import '../styles/login.css';

export default function LoginPage() {
  return (
    <div className="login-bg">
      <div className="login-overlay">
        <h2>Welcome to SpellGrave</h2>
        <button className="login-button">Login with Email</button>
        <button className="login-button google">Continue with Google</button>
      </div>
    </div>
  );
}
