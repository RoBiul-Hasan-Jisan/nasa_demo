// Nav.jsx
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="flex gap-6 bg-gray-900 text-white px-6 py-4">
      <Link to="/" className="hover:text-red-400 font-medium">
        Home
      </Link>
      <Link to="/missions" className="hover:text-red-400 font-medium">
        Missions
      </Link>
      <Link to="/about" className="hover:text-red-400 font-medium">
        About
      </Link>
    </nav>
  );
}
