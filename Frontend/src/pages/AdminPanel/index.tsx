import React, { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent
} from "@mui/material";

export default function AdminPanel() {
  // 🔥 1. Wyciągamy isLoading z kontekstu (zmieniamy nazwę na authLoading, żeby nie myliło się z ładowaniem tabeli)
  const { user, token, isLoading: authLoading } = useAuth();
  
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5249/api/Users?page=1&pageSize=50", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Nie udało się pobrać listy użytkowników.");
      
      const data = await response.json();
      setUsersList(data.users); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 2. Zmieniamy useEffect: Pobieramy dane TYLKO wtedy, gdy autoryzacja skończyła się ładować i mamy token
  useEffect(() => {
    if (!authLoading && token) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, token]);

  // 🔥 3. KROK BLOKUJĄCY: Jeśli kontekst jeszcze czyta localStorage, nie pokazujemy nic poza komunikatem oczekiwania
  if (authLoading) {
    return <Container>Sprawdzanie autoryzacji...</Container>;
  }

  // 🔥 4. Dopiero teraz (gdy authLoading jest false) bezpiecznie sprawdzamy rolę
  if (user?.role !== "Admin") {
    return (
      <Container>
        <h2>Brak dostępu</h2>
        <p>Ta strona jest dostępna wyłącznie dla administratorów.</p>
      </Container>
    );
  }

  if (loading) return <Container>Ładowanie użytkowników...</Container>;

  return (
    <Container component="main">
      <h1>Panel Administratora</h1>
      
      {error && <p>Błąd: {error}</p>}
      {successMessage && <p>{successMessage}</p>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nazwa użytkownika</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Obecna rola</TableCell>
              <TableCell>Zmień rolę</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersList.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={u.role}
                    disabled={u.username === user.username} 
                    onChange={(e: SelectChangeEvent) => handleRoleChange(u.id, e.target.value)}
                  >
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );

  // Dodatkowa funkcja pomocnicza (musi być wewnątrz komponentu)
  async function handleRoleChange(userId: string, newRole: string) {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(`http://localhost:5249/api/Users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ newRole: newRole })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Nie udało się zmienić roli.");
      }
      setSuccessMessage(`Rola została pomyślnie zmieniona na ${newRole}!`);
      fetchUsers(); 
    } catch (err: any) {
      setError(err.message);
    }
  }
}