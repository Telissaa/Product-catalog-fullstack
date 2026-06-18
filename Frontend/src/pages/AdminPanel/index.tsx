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
  SelectChangeEvent,
  Box,
  Typography,
  Alert
} from "@mui/material";

import { styles } from "./AdminPanel.styles";

export default function AdminPanel() {
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

  useEffect(() => {
    if (!authLoading && token) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, token]);

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

  // Weryfikacja stanu autoryzacji
  if (authLoading) {
    return (
      <Box sx={styles.pageWrapper}>
        <Typography variant="h6">Sprawdzanie autoryzacji...</Typography>
      </Box>
    );
  }

  // Weryfikacja uprawnień administracyjnych
  if (user?.role !== "Admin") {
    return (
      <Box sx={styles.pageWrapper}>
        <Paper elevation={3} sx={styles.accessDeniedCard}>
          <Typography variant="h4" color="error" sx={{ mb: 2, fontWeight: "bold" }}>
            Brak dostępu
          </Typography>
          <Typography variant="body1">
            Ta strona jest dostępna wyłącznie dla administratorów.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Weryfikacja pobierania danych
  if (loading) {
    return (
      <Box sx={styles.pageWrapper}>
        <Typography variant="h6">Ładowanie użytkowników...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.pageWrapper}>
      <Paper elevation={3} sx={styles.card}>
        <Typography component="h1" variant="h4" sx={styles.header}>
          Panel Administratora
        </Typography>
        
        {error && <Alert severity="error" sx={styles.alertBox}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={styles.alertBox}>{successMessage}</Alert>}

        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table>
            <TableHead sx={styles.tableHead}>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>ID</TableCell>
                <TableCell sx={styles.tableHeadCell}>Nazwa użytkownika</TableCell>
                <TableCell sx={styles.tableHeadCell}>Email</TableCell>
                <TableCell sx={styles.tableHeadCell}>Obecna rola</TableCell>
                <TableCell sx={styles.tableHeadCell}>Zmień rolę</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersList.map((u: any) => (
                <TableRow key={u.id} sx={styles.tableRow}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Typography 
                      component="span" 
                      sx={{ 
                        fontWeight: "bold", 
                        color: u.role === "Admin" ? "#f35e20" : "#20B6F3" 
                      }}
                    >
                      {u.role}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={u.role}
                      disabled={u.username === user.username} 
                      onChange={(e: SelectChangeEvent) => handleRoleChange(u.id, e.target.value)}
                      sx={styles.selectField}
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
      </Paper>
    </Box>
  );
}