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
  Button
} from "@mui/material";

import { styles } from "./DeletedProducts.styles";

export default function DeletedProducts() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [deletedProducts, setDeletedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeletedProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5249/api/products/deleted",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok)
        throw new Error("Nie udało się pobrać listy usuniętych produktów.");

      const data = await response.json();
      setDeletedProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && token) {
      fetchDeletedProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, token]);

  const handleRestoreProduct = async (productId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5249/api/products/${productId}/restore`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Nie udało się przywrócić produktu.");

      alert("Produkt został przywrócony!");
      fetchDeletedProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (authLoading) {
    return (
      <Box sx={styles.pageWrapper}>
        <Typography variant="h6">Sprawdzanie autoryzacji...</Typography>
      </Box>
    );
  }

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

  if (loading) {
    return (
      <Box sx={styles.pageWrapper}>
        <Typography variant="h6">Ładowanie archiwum...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.pageWrapper}>
      <Paper elevation={3} sx={styles.card}>
        <Typography component="h1" variant="h4" sx={styles.header}>
          Kosz - Usunięte Produkty
        </Typography>

        {error && <Alert severity="error" sx={styles.alertBox}>{error}</Alert>}

        {deletedProducts.length === 0 ? (
          <Box sx={styles.emptyMessage}>
            <Typography variant="h6">Kosz jest pusty. Żaden produkt nie został zarchiwizowany.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table>
              <TableHead sx={styles.tableHead}>
                <TableRow>
                  <TableCell sx={styles.tableHeadCell}>ID</TableCell>
                  <TableCell sx={styles.tableHeadCell}>Nazwa produktu</TableCell>
                  <TableCell sx={styles.tableHeadCell}>Opis</TableCell>
                  <TableCell sx={styles.tableHeadCell}>Data usunięcia</TableCell>
                  <TableCell sx={styles.tableHeadCell}>Akcje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deletedProducts.map((prod: any) => (
                  <TableRow key={prod.id} sx={styles.tableRow}>
                    <TableCell sx={{ fontWeight: "bold", color: "#555" }}>{prod.id}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{prod.title}</TableCell>
                    <TableCell>{prod.description}</TableCell>
                    <TableCell>
                      {new Date(prod.creationDate).toLocaleDateString("pl-PL")}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        sx={styles.btnRestore}
                        onClick={() => handleRestoreProduct(prod.id)}
                      >
                        Przywróć
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}