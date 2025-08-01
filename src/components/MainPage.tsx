import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function handleLogout() {
  signOut(auth).then(() => {
    window.location.href = "/login";
  });
}

// In your JSX:
<button
  onClick={handleLogout}
  className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white text-sm"
>
  Logout
</button>

