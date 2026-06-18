import React, { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Alert,
  TextField,
  Button
} from "@mui/material";

import { styles } from "./CategoryPanel.styles";

export default function CategoryPanel() {
  const { user, token, isLoading: authLoading } = useAuth();

  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5249/api/Categories");
      if (!response.ok) throw new Error("Nie udało się pobrać kategorii.");

      const data = await response.json();
      setCategories(data.categories); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!authLoading && token) {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, token]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!newCategoryName.trim()) {
      setError("Nazwa kategorii nie może być pusta.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5249/api/Categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) throw new Error("Błąd podczas dodawania kategorii.");

      setSuccessMessage("Kategoria dodana!");
      setNewCategoryName("");
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditSubmit = async (categoryId: number) => {
    setError(null);
    setSuccessMessage(null);

    if (!editName.trim()) {
      setError("Nazwa nie może być pusta.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5249/api/Categories/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: editName }),
        },
      );

      if (!response.ok) throw new Error("Błąd edycji kategorii.");

      setSuccessMessage("Kategoria zaktualizowana!");
      setEditingId(null);
      setEditName("");
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę kategorię?")) return;

    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        `http://localhost:5249/api/Categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok)
        throw new Error(
          "Błąd podczas usuwania. Kategoria może być powiązana z produktami.",
        );

      setSuccessMessage("Kategoria usunięta.");
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

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

  return (
    <Box sx={styles.pageWrapper}>
      <Paper elevation={3} sx={styles.card}>
        <Typography component="h1" variant="h4" sx={styles.header}>
          Zarządzanie Kategoriami
        </Typography>

        {error && <Alert severity="error" sx={styles.alertBox}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={styles.alertBox}>{successMessage}</Alert>}

        <Box component="form" onSubmit={handleAddCategory} sx={styles.addForm}>
          <TextField
            size="small"
            label="Nowa kategoria..."
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            sx={styles.textField}
          />
          <Button type="submit" variant="contained" sx={styles.btnPrimary}>
            Dodaj
          </Button>
        </Box>

        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table>
            <TableHead sx={styles.tableHead}>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>ID</TableCell>
                <TableCell sx={styles.tableHeadCell}>Nazwa</TableCell>
                <TableCell sx={styles.tableHeadCell}>Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat: any) => (
                <TableRow key={cat.id} sx={styles.tableRow}>
                  <TableCell sx={{ fontWeight: "bold", color: "#555" }}>{cat.id}</TableCell>
                  <TableCell>
                    {editingId === cat.id ? (
                      <TextField
                        size="small"
                        fullWidth
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        sx={styles.textField}
                      />
                    ) : (
                      <Typography sx={{ fontWeight: "medium" }}>{cat.name}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={styles.actionCell}>
                      {editingId === cat.id ? (
                        <>
                          <Button size="small" variant="contained" sx={styles.btnSuccess} onClick={() => handleEditSubmit(cat.id)}>
                            Zapisz
                          </Button>
                          <Button size="small" variant="outlined" sx={styles.btnCancel} onClick={() => setEditingId(null)}>
                            Anuluj
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            sx={styles.btnEditInfo}
                            onClick={() => {
                              setEditingId(cat.id);
                              setEditName(cat.name);
                            }}
                          >
                            Edytuj
                          </Button>
                          <Button 
                            size="small" 
                            variant="contained" 
                            sx={styles.btnDeleteWarning} 
                            onClick={() => handleDelete(cat.id)}
                          >
                            Usuń
                          </Button>
                        </>
                      )}
                    </Box>
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