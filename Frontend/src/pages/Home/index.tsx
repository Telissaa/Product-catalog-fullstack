import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState, useMemo } from "react";
import { ProductType } from "../../types/products";
import { getProductsData } from "../../store/products";
import { Link } from "react-router-dom";

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  SelectChangeEvent,
  Pagination 
} from "@mui/material";

export default function Home() {
  const [rows, setRows] = useState<ProductType[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  
  // Stany dla filtrów (Backend)
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  // Stany dla stronnicowania (Backend)
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Pobieranie danych produktów (z filtrami i paginacją)
  const getProducts = async (categoryFilter?: string, searchFilter?: string, page: number = 1) => {
    const data = await getProductsData({ 
      category: categoryFilter || undefined, 
      search: searchFilter || undefined,
      pageNumber: page // Wysyłamy numer strony do serwera
    });
    
    if (!data) return;

    // Pobieramy produkty i dane o stronach z odpowiedzi API
    const { products, pageNumber: fetchedPage, totalPages: fetchedTotalPages } = data;
    
    setRows(products);
    setPageNumber(fetchedPage);
    setTotalPages(fetchedTotalPages);
  };

  // 🔥 NOWOŚĆ: Pobieramy zawsze pełną listę kategorii bezpośrednio z API
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5249/api/Categories");
      if (response.ok) {
        const data = await response.json();
        // Zabezpieczamy się na wypadek, gdyby API zwracało obiekt { categories: [...] } lub samą tablicę
        const cats = data.categories || data;
        setCategoriesList(cats.map((c: any) => c.name)); 
      }
    } catch (err) {
      console.error("Błąd pobierania kategorii:", err);
    }
  };

  // Uruchamia się raz, po załadowaniu strony
  useEffect(() => {
    getProducts(undefined, undefined, 1);
    fetchCategories(); // 🔥 Od razu pobieramy też listę kategorii
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Obsługa zmiany strony przez kliknięcie na pasku paginacji
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
    getProducts(selectedCategory, searchQuery, value);
  };

  // Obsługa zmiany kategorii (zawsze wracamy na 1. stronę)
  const handleCategoryChange = (event: SelectChangeEvent) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    setPageNumber(1);
    getProducts(newCategory, searchQuery, 1); 
  };

  // Obsługa wyszukiwarki (zawsze wracamy na 1. stronę)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(1);
    getProducts(selectedCategory, searchQuery, 1);
  };

  // Czyszczenie preferencji
  const handleClearFilters = () => {
    setSortOption("");
    setSelectedCategory("");
    setSearchQuery("");
    setPageNumber(1);
    getProducts(undefined, undefined, 1); 
  };

  // Sortowanie (Front)
  const sortedRows = useMemo(() => {
    let result = [...rows];

    if (sortOption === "name-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "name-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === "cat-asc") {
      result.sort((a, b) => {
        const catA = a.categories?.[0] || "";
        const catB = b.categories?.[0] || "";
        return catA.localeCompare(catB);
      });
    } else if (sortOption === "cat-desc") {
      result.sort((a, b) => {
        const catA = a.categories?.[0] || "";
        const catB = b.categories?.[0] || "";
        return catB.localeCompare(catA);
      });
    }

    return result;
  }, [rows, sortOption]);

  return (
    <div>
      <h1>Lista Produktów</h1>

      {/* Pasek preferencji */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center", flexWrap: "wrap" }}>
        
        {/* Wyszukiwarka */}
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            label="Szukaj produktu..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ backgroundColor: "white", minWidth: 200 }}
          />
          <Button type="submit" variant="contained" size="medium">
            Szukaj
          </Button>
        </Box>
        
        {/* Sortowanie Frontend */}
        <FormControl size="small" sx={{ minWidth: 180, backgroundColor: "white" }}>
          <InputLabel>Sortuj według</InputLabel>
          <Select
            value={sortOption}
            label="Sortuj według"
            onChange={(e) => setSortOption(e.target.value)}
          >
            <MenuItem value=""><em>Brak (Domyślnie)</em></MenuItem>
            <MenuItem value="name-asc">Nazwa: A-Z</MenuItem>
            <MenuItem value="name-desc">Nazwa: Z-A</MenuItem>
            <MenuItem value="cat-asc">Kategoria: A-Z</MenuItem>
            <MenuItem value="cat-desc">Kategoria: Z-A</MenuItem>
          </Select>
        </FormControl>

        {/* Filtrowanie robi Backend */}
        <FormControl size="small" sx={{ minWidth: 180, backgroundColor: "white" }}>
          <InputLabel>Kategoria</InputLabel>
          <Select
            value={selectedCategory}
            label="Kategoria"
            onChange={handleCategoryChange}
          >
            <MenuItem value=""><em>Wszystkie</em></MenuItem>
            {categoriesList.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handleClearFilters}
          sx={{ ml: "auto" }}
        >
          Wyczyść filtry
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela produktów">
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nazwa</strong></TableCell>
              <TableCell><strong>Kategoria</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Link to={`/products/${row.id}`} style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>
                    {row.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {row.categories && row.categories.length > 0 
                    ? row.categories.join(", ") 
                    : "Brak"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pasek Paginacji*/}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
          <Pagination 
            count={totalPages} 
            page={pageNumber} 
            onChange={handlePageChange} 
            color="primary" 
            size="large"
          />
        </Box>
      )}
    </div>
  );
}