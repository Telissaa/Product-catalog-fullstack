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
} from "@mui/material";

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

  // 🔥 NOWA FUNKCJA: Przywracanie produktu
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
      // Odświeżamy listę, żeby przywrócony produkt z niej zniknął
      fetchDeletedProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (authLoading) return <Container>Sprawdzanie autoryzacji...</Container>;
  if (user?.role !== "Admin")
    return (
      <Container>
        <h2>Brak dostępu</h2>
      </Container>
    );
  if (loading) return <Container>Ładowanie archiwum...</Container>;

  return (
    <Container component="main">
      <h1>Kosz - Usunięte Produkty</h1>

      {error && <p style={{ color: "red" }}>Błąd: {error}</p>}

      {deletedProducts.length === 0 ? (
        <p>Kosz jest pusty. Żaden produkt nie został zarchiwizowany.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nazwa produktu</TableCell>
                <TableCell>Opis</TableCell>
                <TableCell>Data usunięcia</TableCell>
                {/* 🔥 NOWA KOLUMNA */}
                <TableCell>Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deletedProducts.map((prod: any) => (
                <TableRow key={prod.id}>
                  <TableCell>{prod.id}</TableCell>
                  <TableCell>{prod.title}</TableCell>
                  <TableCell>{prod.description}</TableCell>
                  <TableCell>
                    {new Date(prod.creationDate).toLocaleDateString("pl-PL")}
                  </TableCell>
                  <TableCell>
                    {/* 🔥 PRZYCISK PRZYWRACANIA */}
                    <button onClick={() => handleRestoreProduct(prod.id)}>
                      Przywróć
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
