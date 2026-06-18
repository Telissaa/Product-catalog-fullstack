import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../components/AuthContext"; 
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  Paper
} from "@mui/material";

import { styles } from "./Login.styles";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Wpisz adres e-mail oraz hasło!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5249/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Błędny login lub hasło.");
      }

      // Zapisanie tokenu w AuthContext
      login(data.token); 
      navigate("/");

    } catch (err: any) {
      setError(err.message || "Brak połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.pageWrapper}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={styles.card}>
          <Typography component="h1" variant="h5" sx={styles.header}>
            Zaloguj się
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adres E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={styles.textField}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={styles.submitButton}
            >
              {loading ? "Logowanie..." : "Zaloguj się"}
            </Button>
            
            <Box sx={styles.linkContainer}>
              <Typography variant="body2" sx={styles.linkText}>
                Nie masz jeszcze konta?{" "}
                <Link to="/api/Auth/register" style={styles.linkAction}>
                  Zarejestruj się
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}