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
  Pagination,
  Typography
} from "@mui/material";

import { styles } from "./Home.styles";

export default function Home() {
  const [rows, setRows] = useState<ProductType[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  
  // Stany filtrów
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  // Stany paginacji
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Pobieranie produktów na podstawie parametrów wyszukiwania i paginacji
  const getProducts = async (categoryFilter?: string, searchFilter?: string, page: number = 1) => {
    const data = await getProductsData({ 
      category: categoryFilter || undefined, 
      search: searchFilter || undefined,
      pageNumber: page
    });
    
    if (!data) return;

    const { products, pageNumber: fetchedPage, totalPages: fetchedTotalPages } = data;
    
    setRows(products);
    setPageNumber(fetchedPage);
    setTotalPages(fetchedTotalPages);
  };

  // Pobieranie listy kategorii dla komponentu Select
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5249/api/Categories");
      if (response.ok) {
        const data = await response.json();
        const cats = data.categories || data;
        setCategoriesList(cats.map((c: any) => c.name)); 
      }
    } catch (err) {
      console.error("Błąd pobierania kategorii:", err);
    }
  };

  // Inicjalizacja danych
  useEffect(() => {
    getProducts(undefined, undefined, 1);
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Obsługa zdarzeń
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
    getProducts(selectedCategory, searchQuery, value);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    setPageNumber(1);
    getProducts(newCategory, searchQuery, 1); 
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(1);
    getProducts(selectedCategory, searchQuery, 1);
  };

  const handleClearFilters = () => {
    setSortOption("");
    setSelectedCategory("");
    setSearchQuery("");
    setPageNumber(1);
    getProducts(undefined, undefined, 1); 
  };

  // Logika sortowania po stronie klienta
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
    <Box sx={styles.pageWrapper}>
      <Box sx={styles.container}>
        <Typography variant="h3" component="h1" sx={styles.header}>
          Katalog Produktów
        </Typography>

        <Paper elevation={3} sx={styles.filterCard}>
          <Box component="form" onSubmit={handleSearchSubmit} sx={styles.searchBox}>
            <TextField
              size="small"
              label="Szukaj produktu..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              sx={styles.searchInput}
            />
            <Button type="submit" variant="contained" sx={styles.searchButton}>
              Szukaj
            </Button>
          </Box>
          
          <FormControl size="small" sx={styles.formControl}>
            <InputLabel sx={styles.inputLabel}>Sortuj według</InputLabel>
            <Select
              value={sortOption}
              label="Sortuj według"
              onChange={(e) => setSortOption(e.target.value)}
              sx={styles.select}
            >
              <MenuItem value=""><em>Brak (Domyślnie)</em></MenuItem>
              <MenuItem value="name-asc">Nazwa: A-Z</MenuItem>
              <MenuItem value="name-desc">Nazwa: Z-A</MenuItem>
              <MenuItem value="cat-asc">Kategoria: A-Z</MenuItem>
              <MenuItem value="cat-desc">Kategoria: Z-A</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={styles.formControl}>
            <InputLabel sx={styles.inputLabel}>Kategoria</InputLabel>
            <Select
              value={selectedCategory}
              label="Kategoria"
              onChange={handleCategoryChange}
              sx={styles.select}
            >
              <MenuItem value=""><em>Wszystkie</em></MenuItem>
              {categoriesList.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={handleClearFilters} sx={styles.clearButton}>
            Wyczyść filtry
          </Button>
        </Paper>

        <TableContainer component={Paper} elevation={3} sx={styles.tableContainer}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela produktów">
            <TableHead sx={styles.tableHead}>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>ID</TableCell>
                <TableCell sx={styles.tableHeadCell}>Nazwa</TableCell>
                <TableCell sx={styles.tableHeadCell}>Kategoria</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.length > 0 ? (
                sortedRows.map((row) => (
                  <TableRow key={row.id} sx={styles.tableRow}>
                    <TableCell sx={styles.tableCellId}>{row.id}</TableCell>
                    <TableCell>
                      <Link to={`/products/${row.id}`} style={styles.productLink}>
                        {row.title}
                      </Link>
                    </TableCell>
                    <TableCell sx={styles.tableCellCategory}>
                      {row.categories && row.categories.length > 0 
                        ? row.categories.join(", ") 
                        : <span style={{ color: "#aaa", fontStyle: "italic" }}>Brak</span>}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 5, color: "#666", fontSize: "16px" }}>
                    Nie znaleziono produktów spełniających podane kryteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={styles.paginationWrapper}>
            <Pagination 
              count={totalPages} 
              page={pageNumber} 
              onChange={handlePageChange} 
              size="large"
              sx={styles.pagination}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}