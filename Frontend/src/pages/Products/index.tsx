import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent
} from "@mui/material";

import { styles } from "./ProductDetails.styles";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Stany dla komentarzy
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // Stany dla edycji produktu
  const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
  const [editProductTitle, setEditProductTitle] = useState("");
  const [editProductDescription, setEditProductDescription] = useState("");
  const [editProductImageUrl, setEditProductImageUrl] = useState("");
  const [editProductCategoryIds, setEditProductCategoryIds] = useState<number[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [productEditError, setProductEditError] = useState<string | null>(null);

  const fetchProductData = async () => {
    try {
      const response = await fetch(`http://localhost:5249/api/products/${id}`);
      if (!response.ok) throw new Error("Nie znaleziono produktu");
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error("Błąd pobierania produktu:", err);
    } finally {
      setLoading(false);
    }
  };

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
    fetchProductData();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDeleteProduct = async () => {
    if (
      !window.confirm(
        "Czy na pewno chcesz zarchiwizować ten produkt? Pojawi się on na liście usuniętych."
      )
    )
      return;

    try {
      const response = await fetch(`http://localhost:5249/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Błąd podczas usuwania produktu.");

      alert("Produkt został pomyślnie usunięty!");
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOpenProductEdit = () => {
    setProductEditError(null);
    setEditProductTitle(product.title);
    setEditProductDescription(product.description);
    setEditProductImageUrl(product.imageUrl || "");
    
    if (product.categories && allCategories.length > 0) {
      const currentCatIds = allCategories
        .filter((cat) => product.categories.includes(cat.name))
        .map((cat) => cat.id);
      setEditProductCategoryIds(currentCatIds);
    } else {
      setEditProductCategoryIds([]);
    }
    
    setIsProductEditModalOpen(true);
  };

  const handleProductEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductEditError(null);

    if (!editProductTitle.trim()) {
      setProductEditError("Tytuł produktu nie może być pusty!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5249/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editProductTitle,
          description: editProductDescription,
          imageUrl: editProductImageUrl,
          categories: editProductCategoryIds,
        }),
      });

      if (!response.ok) throw new Error("Nie udało się zaktualizować produktu.");

      setIsProductEditModalOpen(false);
      fetchProductData();
    } catch (err: any) {
      setProductEditError(err.message || "Błąd podczas edycji produktu.");
    }
  };

  // Dostosowano do obsługi komponentu Select z MUI
  const handleCategoryChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setEditProductCategoryIds(typeof value === "string" ? value.split(",").map(Number) : value);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!commentText.trim()) {
      setError("Treść komentarza nie może być pusta!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5249/api/Comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: Number(id),
          description: commentText,
        }),
      });

      if (!response.ok) throw new Error("Nie udało się dodać komentarza.");

      setCommentText("");
      setIsModalOpen(false);
      fetchProductData();
    } catch (err: any) {
      setError(err.message || "Błąd serwera.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten komentarz?")) return;

    try {
      const response = await fetch(
        `http://localhost:5249/api/Comment/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Nie udało się usunąć komentarza.");
      fetchProductData();
    } catch (err: any) {
      alert(err.message || "Błąd usuwania komentarza.");
    }
  };

  const handleCommentEditSubmit = async (commentId: number) => {
    if (!editText.trim()) {
      alert("Treść komentarza nie może być pusta!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5249/api/Comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: commentId, description: editText }),
        }
      );

      if (!response.ok) throw new Error("Nie udało się zaktualizować komentarza.");

      setEditingCommentId(null);
      setEditText("");
      fetchProductData();
    } catch (err: any) {
      alert(err.message || "Błąd edycji komentarza.");
    }
  };

  if (loading) {
    return (
      <Box sx={styles.pageWrapper}>
        <Container><Typography variant="h5">Ładowanie produktu...</Typography></Container>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={styles.pageWrapper}>
        <Container><Typography variant="h5">Produkt nie istnieje.</Typography></Container>
      </Box>
    );
  }

  return (
    <Box sx={styles.pageWrapper}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={styles.mainCard}>
          <Typography variant="h4" sx={styles.productTitle}>
            {product.title}
          </Typography>

          {product.imageUrl && (
            <Box component="img" src={product.imageUrl} alt={product.title} sx={styles.productImage} />
          )}

          <Typography sx={styles.detailText}>
            <strong>Opis:</strong> {product.description}
          </Typography>

          <Box sx={{ mb: 1.5, mt: 2 }}>
            <Typography component="span" sx={{ fontWeight: "bold", mr: 1, color: "#333" }}>
              Kategorie:
            </Typography>
            {product.categories && product.categories.length > 0 ? (
              product.categories.map((cat: string) => (
                <Chip key={cat} label={cat} size="small" sx={styles.chip} />
              ))
            ) : (
              <Typography component="span" sx={{ color: "#aaa", fontStyle: "italic" }}>Brak przypisanych kategorii</Typography>
            )}
          </Box>

          <Typography sx={styles.detailText}>
            <strong>Autor:</strong> {product.creatorUserName}
          </Typography>
          <Typography sx={styles.detailText}>
            <strong>Dodano:</strong> {new Date(product.creationDate).toLocaleDateString("pl-PL")}
          </Typography>

          {user?.role === "Admin" && (
            <Box sx={styles.adminActionBox}>
              <Button variant="contained" sx={styles.btnEditInfo} onClick={handleOpenProductEdit}>
                Edytuj produkt
              </Button>
              <Button variant="contained" sx={styles.btnDeleteWarning} onClick={handleDeleteProduct}>
                Usuń produkt
              </Button>
            </Box>
          )}
        </Paper>

        {isProductEditModalOpen && (
          <Paper elevation={2} sx={styles.editModalCard}>
            <Typography variant="h5" sx={{ color: "#20B6F3", fontWeight: "bold", mb: 2 }}>
              Edytuj produkt
            </Typography>
            {productEditError && <Typography color="error" sx={{ mb: 2 }}>{productEditError}</Typography>}
            
            <Box component="form" onSubmit={handleProductEditSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Tytuł"
                fullWidth
                size="small"
                value={editProductTitle}
                onChange={(e) => setEditProductTitle(e.target.value)}
              />
              <TextField
                label="Opis"
                multiline
                rows={4}
                fullWidth
                size="small"
                value={editProductDescription}
                onChange={(e) => setEditProductDescription(e.target.value)}
              />
              <TextField
                label="URL Obrazka"
                fullWidth
                size="small"
                value={editProductImageUrl}
                onChange={(e) => setEditProductImageUrl(e.target.value)}
              />
              
              <FormControl size="small" fullWidth>
                <InputLabel>Kategorie</InputLabel>
                <Select
                  multiple
                  value={editProductCategoryIds}
                  onChange={handleCategoryChange}
                  label="Kategorie"
                >
                  {allCategories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button type="submit" variant="contained" sx={styles.btnSuccess}>
                  Zapisz zmiany
                </Button>
                <Button variant="outlined" sx={styles.btnCancel} onClick={() => setIsProductEditModalOpen(false)}>
                  Anuluj
                </Button>
              </Box>
            </Box>
          </Paper>
        )}

        <Typography variant="h5" sx={styles.sectionTitle}>
          Komentarze
        </Typography>

        {product.comments && product.comments.length > 0 ? (
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table>
              <TableHead sx={styles.tableHead}>
                <TableRow>
                  <TableCell sx={styles.tableHeadCell}>Treść</TableCell>
                  <TableCell sx={styles.tableHeadCell}>Data utworzenia</TableCell>
                  <TableCell sx={styles.tableHeadCell}>Autor</TableCell>
                  <TableCell sx={styles.tableHeadCell}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.comments.map((comment: any) => {
                  const loggedInUser = user
                    ? (user as any).username ||
                      (user as any).unique_name ||
                      (user as any)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
                      ""
                    : "";

                  return (
                    <TableRow key={comment.id} sx={styles.tableRow}>
                      <TableCell>
                        {editingCommentId === comment.id ? (
                          <TextField
                            size="small"
                            fullWidth
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                        ) : (
                          comment.description
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(comment.creationDate).toLocaleDateString("pl-PL")}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                        {comment.creatorUserName}
                      </TableCell>
                      <TableCell>
                        <Box sx={styles.actionCell}>
                          {editingCommentId === comment.id ? (
                            <>
                              <Button size="small" variant="contained" sx={styles.btnSuccess} onClick={() => handleCommentEditSubmit(comment.id)}>
                                Zapisz
                              </Button>
                              <Button size="small" variant="outlined" sx={styles.btnCancel} onClick={() => setEditingCommentId(null)}>
                                Anuluj
                              </Button>
                            </>
                          ) : (
                            loggedInUser &&
                            loggedInUser.toLowerCase() === comment.creatorUserName?.toLowerCase() && (
                              <Button
                                size="small"
                                variant="contained"
                                sx={styles.btnEditInfo}
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditText(comment.description);
                                }}
                              >
                                Edytuj
                              </Button>
                            )
                          )}

                          {user?.role === "Admin" && (
                            <Button
                              size="small"
                              variant="contained"
                              sx={styles.btnDeleteWarning}
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Usuń (Admin)
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ color: "#666", fontStyle: "italic" }}>
            Brak komentarzy dla tego produktu. Bądź pierwszy!
          </Typography>
        )}

        {user && !isModalOpen && (
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" sx={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
              Dodaj komentarz
            </Button>
          </Box>
        )}

        {isModalOpen && (
          <Paper elevation={2} sx={styles.commentFormCard}>
            <Typography variant="h6" sx={{ color: "#8415b2", fontWeight: "bold", mb: 2 }}>
              Nowy komentarz
            </Typography>
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                multiline
                rows={3}
                fullWidth
                placeholder="Wpisz treść komentarza..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button type="submit" variant="contained" sx={styles.btnSuccess}>
                  Zapisz
                </Button>
                <Button variant="outlined" sx={styles.btnCancel} onClick={() => setIsModalOpen(false)}>
                  Anuluj
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
}