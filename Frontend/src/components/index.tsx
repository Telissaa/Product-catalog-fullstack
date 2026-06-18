import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext"; 

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Strona Główna</Link>

      {user ? (
        <>
          {/* Widoczne tylko dla Admina */}
          {user.role === "Admin" && (
            <>
              <Link to="/admin/users">Panel Admina</Link>
              <Link to="/admin/categories">Kategorie</Link>
              <Link to="/admin/deleted-products">Usunięte produkty</Link>
            </>
          )}
          <Link to="/add-product">Dodaj produkt</Link>
          <span>Zalogowany jako: {user.username} ({user.role})</span>
          <button onClick={logout}>Wyloguj się</button>
        </>
      ) : (
        <>
          <Link to="/api/Auth/login">Logowanie</Link>
          <Link to="/api/Auth/register">Rejestracja</Link>
        </>
      )}
    </nav>
  );
}