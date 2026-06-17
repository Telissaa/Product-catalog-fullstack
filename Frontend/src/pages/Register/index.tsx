import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Paper 
} from "@mui/material";

export default function Register() {
  const navigate = useNavigate();
  
  // Stany dla pól formularza
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Stany dla obsługi komunikacji z API
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Walidacja po stronie klienta
    if (!username || !email || !password) {
      setError("Wszystkie pola są wymagane!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5249/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : null;

      if (!response.ok) {
        // Jeśli backend przekazał konkretny komunikat o błędzie (np. za słabe hasło, zajęty mail)
        throw new Error(data?.message || "Coś poszło nie tak podczas rejestracji.");
      }

      setSuccess(true);
      
      // Po 2 sekundach sukcesu automatycznie przenosimy użytkownika do logowania
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Brak połączenia z serwerem.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper elevation={3} sx={{ padding: 4, width: "100%", borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 3, fontWeight: "bold" }}>
            Stwórz nowe konto
          </Typography>

          {/* Wyświetlanie błędów */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Wyświetlanie sukcesu */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Rejestracja udana! Przekierowanie do logowania...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nazwa użytkownika"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={success}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adres E-mail"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={success}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Hasło"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={success}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, padding: 1.2, fontWeight: "bold" }}
              disabled={success}
            >
              Zarejestruj się
            </Button>
            
            <Box sx={{ textAlignment: "center", mt: 2 }}>
              <Typography variant="body2" align="center" color="text.secondary">
                Masz już konto?{" "}
                <Link to="/login" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
                  Zaloguj się
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}