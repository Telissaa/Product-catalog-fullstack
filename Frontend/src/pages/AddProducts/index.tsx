import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { Container, Button, TextField, Box } from "@mui/material";

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

  // 🔥 NOWOŚĆ: Stany dla szybkiego tworzenia nowej kategorii
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Pobieranie kategorii z backendu
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

  // Obsługa zmiany zaznaczenia wielu kategorii
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
    setSelectedCategoryIds(selectedOptions);
  };

  // 🔥 NOWOŚĆ: Funkcja tworzenia nowej kategorii "w locie"
  const handleCreateCategorySubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setCategoryError(null);

    if (!newCategoryName.trim()) {
      setCategoryError("Nazwa kategorii nie może być pusta!");
      return;
    }

    try {
      // Strzelamy do Twojego endpointu POST /api/Categories (używamy tokenu zalogowanego usera)
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
        throw new Error(resData.message || "Nie udało się stworzyć kategorii. Może już istnieć.");
      }

      // 1. Odświeżamy listę wszystkich kategorii z bazy
      await fetchCategories();

      // 2. Automatycznie zaznaczamy nowo dodaną kategorię
      // Zakładamy, że backend w odpowiedzi zwraca obiekt stworzonej kategorii w polu 'category' lub bezpośrednio
      const createdCategory = resData.category || resData;
      if (createdCategory && createdCategory.id) {
        setSelectedCategoryIds((prev) => [...prev, createdCategory.id]);
      }

      // 3. Resetujemy formularz kategorii
      setNewCategoryName("");
      setIsAddingNewCategory(false);
      alert("Kategoria została pomyślnie utworzona i dodana do listy!");
    } catch (err: any) {
      setCategoryError(err.message || "Błąd podczas dodawania kategorii.");
    }
  };

  // Zapisywanie całego produktu
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
        throw new Error("Nie udało się dodać produktu. Sprawdź poprawność danych.");
      }

      alert("Produkt został dodany pomyślnie!");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Błąd serwera.");
    }
  };

  if (!user) {
    return <Container>Musisz być zalogowany, aby dodać produkt.</Container>;
  }

  return (
    <Container component="main" maxWidth="sm">
      <div style={{ border: "2px solid #1976d2", padding: "20px", marginTop: "40px", backgroundColor: "#f3f9ff", borderRadius: "8px" }}>
        <h2>Dodaj nowy produkt</h2>
        
        {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <label>
            <strong>Tytuł:</strong>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
          
          <label>
            <strong>Opis:</strong>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
          
          <label>
            <strong>URL Obrazka (opcjonalnie):</strong>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              placeholder="https://link-do-zdjecia.com/img.jpg"
            />
          </label>
          
          {/* Sekcja Kategorii z możliwością szybkiego dodawania */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
              <strong>Kategorie (przytrzymaj Ctrl, by wybrać wiele):</strong>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                sx={{ ml: "auto", textTransform: "none", fontWeight: "bold" }}
              >
                {isAddingNewCategory ? "✕ Zamknij" : "+ Stwórz nową kategorię"}
              </Button>
            </Box>

            {/* 🔥 NOWOŚĆ: Mini-formularz szybkiego dodawania kategorii */}
            {isAddingNewCategory && (
              <Box sx={{ p: 1.5, border: "1px dashed #1976d2", borderRadius: "4px", backgroundColor: "#fff", mb: 1 }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#555" }}>Nowa kategoria:</p>
                {categoryError && <p style={{ color: "red", fontSize: "12px", margin: "0 0 5px 0" }}>{categoryError}</p>}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="np. Słodycze"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <Button variant="contained" color="success" size="small" onClick={handleCreateCategorySubmit}>
                    Dodaj
                  </Button>
                </Box>
              </Box>
            )}

            <select
              multiple
              value={selectedCategoryIds.map(String)}
              onChange={handleCategoryChange}
              style={{ width: "100%", padding: "8px", height: "120px" }}
            >
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Box>
          
          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Dodaj produkt
            </Button>
            <Button type="button" variant="outlined" color="secondary" fullWidth onClick={() => navigate("/")}>
              Anuluj
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}