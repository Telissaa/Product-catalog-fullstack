import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext"; 

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Strona Główna</Link>

      {user ? (
        // Co widzi ZALOGOWANY użytkownik 
        <>
          <span>Zalogowany jako: {user.username} ({user.role})</span>
          <button onClick={logout}>Wyloguj się</button>
        </>
      ) : (
        // Co widzi NIEZALOGOWANY użytkownik
        <>
          <Link to="/api/Auth/login">Logowanie</Link>
          <Link to="/api/Auth/register">Rejestracja</Link>
        </>
      )}
    </nav>
  );
}