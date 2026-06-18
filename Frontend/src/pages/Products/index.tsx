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
} from "@mui/material";

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

  // 🔥 Stany dla edycji produktu
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

  // Usuwanie produktu
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

  // 🔥 Otwieranie modalu edycji produktu z aktualnymi danymi
  const handleOpenProductEdit = () => {
    setProductEditError(null);
    setEditProductTitle(product.title);
    setEditProductDescription(product.description);
    setEditProductImageUrl(product.imageUrl || "");
    
    // Dopasowujemy nazwy kategorii produktu do ich ID z pełnej listy
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

  // 🔥 Zapisywanie edycji produktu
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
          categories: editProductCategoryIds, // Lista ID kategorii zgodnie z DTO
        }),
      });

      if (!response.ok) throw new Error("Nie udało się zaktualizować produktu.");

      setIsProductEditModalOpen(false);
      fetchProductData(); // Odświeżamy widok
    } catch (err: any) {
      setProductEditError(err.message || "Błąd podczas edycji produktu.");
    }
  };

  // Obsługa wielokrotnego wyboru kategorii
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
    setEditProductCategoryIds(selectedOptions);
  };

  // Obsługa dodawania nowego komentarza
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

  // Usuwanie komentarza
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

  // Edycja komentarza
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

  if (loading) return <Container>Ładowanie produktu...</Container>;
  if (!product) return <Container>Produkt nie istnieje.</Container>;

  return (
    <Container component="main">
      <div>
        <h1>{product.title}</h1>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            style={{ maxWidth: "300px", display: "block", marginBottom: "15px" }}
          />
        )}
        <p>
          <strong>Opis:</strong> {product.description}
        </p>
        
        {/* 🔥 NOWE DANE PRODUKTU */}
        <p>
          <strong>Kategorie:</strong>{" "}
          {product.categories && product.categories.length > 0 
            ? product.categories.join(", ") 
            : "Brak przypisanych kategorii"}
        </p>
        <p>
          <strong>Autor:</strong> {product.creatorUserName}
        </p>
        <p>
          <strong>Dodano:</strong>{" "}
          {new Date(product.creationDate).toLocaleDateString("pl-PL")}
        </p>

        {/* Przyciski Admina */}
        {user?.role === "Admin" && (
          <div style={{ marginTop: "15px", marginBottom: "15px", display: "flex", gap: "10px" }}>
            <button
              onClick={handleOpenProductEdit}
            >
              Edytuj produkt
            </button>
            <button
              onClick={handleDeleteProduct}
            >
              Usuń produkt
            </button>
          </div>
        )}
      </div>

      {/* 🔥 FORMULARZ EDYCJI PRODUKTU (MODAL) */}
      {isProductEditModalOpen && (
        <div style={{ border: "2px solid #ed6c02", padding: "20px", marginBottom: "20px", backgroundColor: "#fff4e5" }}>
          <h3>Edytuj produkt</h3>
          {productEditError && <p style={{ color: "red" }}>{productEditError}</p>}
          <form onSubmit={handleProductEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
            <label>
              <strong>Tytuł:</strong>
              <input
                type="text"
                value={editProductTitle}
                onChange={(e) => setEditProductTitle(e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </label>
            <label>
              <strong>Opis:</strong>
              <textarea
                rows={4}
                value={editProductDescription}
                onChange={(e) => setEditProductDescription(e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </label>
            <label>
              <strong>URL Obrazka:</strong>
              <input
                type="text"
                value={editProductImageUrl}
                onChange={(e) => setEditProductImageUrl(e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </label>
            <label>
              <strong>Kategorie (przytrzymaj Ctrl, by wybrać wiele):</strong>
              <select
                multiple
                value={editProductCategoryIds.map(String)}
                onChange={handleCategoryChange}
                style={{ width: "100%", padding: "5px", height: "100px" }}
              >
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" style={{ padding: "8px 16px", fontWeight: "bold" }}>Zapisz zmiany</button>
              <button type="button" onClick={() => setIsProductEditModalOpen(false)} style={{ padding: "8px 16px" }}>Anuluj</button>
            </div>
          </form>
        </div>
      )}

      <hr />

      <h2>Komentarze</h2>

      {product.comments && product.comments.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Treść</TableCell>
                <TableCell>Data utworzenia</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell>Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.comments.map((comment: any) => {
                const loggedInUser = user
                  ? (user as any).username ||
                    (user as any).unique_name ||
                    (user as any)[
                      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                    ] ||
                    ""
                  : "";

                return (
                  <TableRow key={comment.id}>
                    <TableCell>
                      {editingCommentId === comment.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          style={{ width: "100%" }}
                        />
                      ) : (
                        comment.description
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(comment.creationDate).toLocaleDateString("pl-PL")}
                    </TableCell>
                    <TableCell>{comment.creatorUserName}</TableCell>
                    
                    <TableCell>
                      {editingCommentId === comment.id ? (
                        <>
                          <button onClick={() => handleCommentEditSubmit(comment.id)}>Zapisz</button>
                          <button onClick={() => setEditingCommentId(null)}>Anuluj</button>
                        </>
                      ) : (
                        loggedInUser &&
                        loggedInUser.toLowerCase() === comment.creatorUserName?.toLowerCase() && (
                          <button
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditText(comment.description);
                            }}
                          >
                            Edytuj
                          </button>
                        )
                      )}

                      {user?.role === "Admin" && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          style={{ marginLeft: "10px" }}
                        >
                          Usuń (Admin)
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>Brak komentarzy dla tego produktu. Bądź pierwszy!</p>
      )}

      {user && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => setIsModalOpen(true)}>Dodaj komentarz</button>
        </div>
      )}

      {isModalOpen && (
        <div
          style={{
            border: "1px solid black",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h3>Nowy komentarz</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleCommentSubmit}>
            <textarea
              rows={4}
              cols={50}
              placeholder="Wpisz treść komentarza..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <br />
            <button type="submit">Zapisz</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              Anuluj
            </button>
          </form>
        </div>
      )}
    </Container>
  );
}