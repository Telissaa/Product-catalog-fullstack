import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import { styles } from "./Navbar.styles";
import logo from "../../assets/logo.svg";
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            mr: 2,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo aplikacji"
            sx={{ height: 40, width: "auto" }}
          />
        </Box>

        {/* Sekcja lewa: Linki nawigacyjne */}
        <Box sx={styles.leftSection}>
          <Button component={Link} to="/" sx={styles.navLink}>
            Strona Główna
          </Button>

          {user?.role === "Admin" && (
            <>
              <Button component={Link} to="/admin/users" sx={styles.navLink}>
                Panel Admina
              </Button>
              <Button
                component={Link}
                to="/admin/categories"
                sx={styles.navLink}
              >
                Kategorie
              </Button>
              <Button
                component={Link}
                to="/admin/deleted-products"
                sx={styles.navLink}
              >
                Usunięte produkty
              </Button>
            </>
          )}
        </Box>

        {/* Sekcja prawa: Status autoryzacji i akcje użytkownika */}
        <Box sx={styles.rightSection}>
          {user ? (
            <>
              <Button component={Link} to="/add-product" sx={styles.addLink}>
                Dodaj produkt
              </Button>

              <Typography sx={styles.userInfo}>
                Zalogowany jako: <strong>{user.username}</strong> ({user.role})
              </Typography>

              <Button onClick={logout} sx={styles.logoutButton}>
                Wyloguj się
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/api/Auth/login"
                sx={styles.authLink}
              >
                Logowanie
              </Button>
              <Button
                component={Link}
                to="/api/Auth/register"
                sx={styles.authLink}
              >
                Rejestracja
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
