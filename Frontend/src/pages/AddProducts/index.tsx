import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import {
  Container,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

import { styles } from "./AddProduct.styles";

export default function AddProduct() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Stany dla produktu
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Stany dla tworzenia nowej kategorii w locie
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5249/api/Categories");
      if (response.ok) {
        const data = await response.json();
        setAllCategories(data.categories || data);
      }
    } catch (err) {
      console.error("Błąd pobierania kategorii:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Obsługa wielokrotnego wyboru komponentu Select z MUI
  const handleCategoryChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setSelectedCategoryIds(
      typeof value === "string" ? value.split(",").map(Number) : value,
    );
  };

  const handleCreateCategorySubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setCategoryError(null);

    if (!newCategoryName.trim()) {
      setCategoryError("Nazwa kategorii nie może być pusta!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5249/api/Categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Name: newCategoryName.trim() }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(
          resData.message ||
            "Nie udało się stworzyć kategorii. Może już istnieć.",
        );
      }

      await fetchCategories();

      const createdCategory = resData.category || resData;
      if (createdCategory && createdCategory.id) {
        setSelectedCategoryIds((prev) => [...prev, createdCategory.id]);
      }

      setNewCategoryName("");
      setIsAddingNewCategory(false);
      alert("Kategoria została pomyślnie utworzona i dodana do listy!");
    } catch (err: any) {
      setCategoryError(err.message || "Błąd podczas dodawania kategorii.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError("Tytuł i opis są wymagane!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5249/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          imageUrl: imageUrl,
          categoryIds: selectedCategoryIds,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Nie udało się dodać produktu. Sprawdź poprawność danych.",
        );
      }

      alert("Produkt został dodany pomyślnie!");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Błąd serwera.");
    }
  };

  if (!user) {
    return (
      <Box sx={styles.pageWrapper}>
        <Container maxWidth="sm">
          <Alert severity="warning">
            Musisz być zalogowany, aby dodać produkt.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={styles.pageWrapper}>
      <Paper elevation={3} sx={styles.card}>
        <Typography component="h1" variant="h5" sx={styles.header}>
          Dodaj nowy produkt
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={styles.form}
        >
          <TextField
            required
            fullWidth
            label="Tytuł"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={styles.textField}
          />

          <TextField
            required
            fullWidth
            multiline
            rows={5}
            label="Opis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={styles.textField}
          />

          <TextField
            fullWidth
            type="url"
            label="URL Obrazka (opcjonalnie)"
            placeholder="https://link-do-zdjecia.com/img.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            sx={styles.textField}
          />

          <Box sx={styles.categorySection}>
            <Box sx={styles.categoryHeaderBox}>
              <Typography sx={styles.categoryLabel}>
                Kategorie (można wybrać wiele):
              </Typography>
              <Button
                variant="text"
                onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                sx={styles.toggleCategoryBtn}
              >
                {isAddingNewCategory ? "✕ Zamknij" : "+ Stwórz nową kategorię"}
              </Button>
            </Box>

            {isAddingNewCategory && (
              <Box sx={styles.newCategoryBox}>
                <Typography sx={styles.newCategoryLabel}>
                  Nowa kategoria:
                </Typography>
                {categoryError && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ display: "block", mb: 1 }}
                  >
                    {categoryError}
                  </Typography>
                )}
                <Box sx={styles.newCategoryInputBox}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="np. Słodycze"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    sx={styles.textField}
                  />
                  <Button
                    variant="contained"
                    sx={styles.btnSuccess}
                    onClick={handleCreateCategorySubmit}
                  >
                    Dodaj
                  </Button>
                </Box>
              </Box>
            )}

            <FormControl fullWidth sx={styles.textField}>
              <InputLabel id="category-select-label">
                Wybierz kategorie
              </InputLabel>
              <Select
                labelId="category-select-label"
                multiple
                value={selectedCategoryIds}
                onChange={handleCategoryChange}
                label="Wybierz kategorie"
              >
                {allCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={styles.buttonGroup}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={styles.btnPrimary}
            >
              Dodaj produkt
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              sx={styles.btnCancel}
              onClick={() => navigate("/")}
            >
              Anuluj
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
