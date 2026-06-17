import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Strona Główna</Link>
      <Link to="/login">Logowanie</Link>
      <Link to="/register">Rejestracja</Link>
    </nav>
  );
}
