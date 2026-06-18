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

import { styles } from "./Register.styles";

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
        // Obsługa błędów zwróconych przez serwer
        throw new Error(data?.message || "Coś poszło nie tak podczas rejestracji.");
      }

      setSuccess(true);
      
      // Przekierowanie do logowania po pomyślnej rejestracji
      setTimeout(() => {
        navigate("/api/Auth/login");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Brak połączenia z serwerem.");
    }
  };

  return (
    <Box sx={styles.pageWrapper}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={styles.card}>
          <Typography component="h1" variant="h5" align="center" sx={styles.header}>
            Stwórz nowe konto
          </Typography>

          {/* Sekcja komunikatów */}
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              Rejestracja udana! Przekierowanie do logowania...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.form}>
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
              sx={styles.textField}
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
              sx={styles.textField}
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
              sx={styles.textField}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={success}
              sx={styles.submitButton}
            >
              Zarejestruj się
            </Button>
            
            <Box sx={styles.linkContainer}>
              <Typography variant="body2" align="center" sx={styles.linkText}>
                Masz już konto?{" "}
                <Link to="/api/Auth/login" style={styles.linkAction}>
                  Zaloguj się
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}