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
      // 🔥 POPRAWKA: Zmiana na "Categories"
      const response = await fetch("http://localhost:5249/api/Categories");
      if (!response.ok) throw new Error("Nie udało się pobrać kategorii.");

      const data = await response.json();
      setCategories(data.categories); // Pamiętamy, że Twój backend zwraca tablicę w obiekcie pod kluczem 'categories'
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
      // 🔥 POPRAWKA: Zmiana na "Categories"
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
      // 🔥 POPRAWKA: Zmiana na "Categories"
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

  if (authLoading) return <Container>Sprawdzanie autoryzacji...</Container>;

  if (user?.role !== "Admin") {
    return (
      <Container>
        <h2>Brak dostępu</h2>
      </Container>
    );
  }

  return (
    <Container component="main">
      <h1>Zarządzanie Kategoriami</h1>

      {error && <p style={{ color: "red" }}>Błąd: {error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleAddCategory} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nowa kategoria..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button type="submit">Dodaj</button>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nazwa</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat: any) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.id}</TableCell>
                <TableCell>
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    cat.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === cat.id ? (
                    <>
                      <button onClick={() => handleEditSubmit(cat.id)}>
                        Zapisz
                      </button>
                      <button onClick={() => setEditingId(null)}>Anuluj</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditName(cat.name);
                        }}
                      >
                        Edytuj
                      </button>
                      <button onClick={() => handleDelete(cat.id)}>Usuń</button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
