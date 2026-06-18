import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const { user, token } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Stany dla dodawania nowego komentarza
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 🔥 NOWE STANY DLA EDYCJI KOMENTARZA
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

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

  useEffect(() => {
    fetchProductData();
  }, [id]);

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

  // 🔥 NOWA FUNKCJA: Obsługa wysyłania edycji do API
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
          body: JSON.stringify({
            id: commentId,
            description: editText,
          }),
        }
      );

      if (!response.ok)
        throw new Error("Nie udało się zaktualizować komentarza.");

      // Resetujemy stany edycji i pobieramy świeże dane
      setEditingCommentId(null);
      setEditText("");
      fetchProductData();
    } catch (err: any) {
      alert(err.message || "Błąd edycji komentarza.");
    }
  };

  if (loading) return <div>Ładowanie produktu...</div>;
  if (!product) return <div>Produkt nie istnieje.</div>;

  return (
    <Container component="main">
      <div>
        <h1>{product.title}</h1>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            style={{ maxWidth: "300px", display: "block" }}
          />
        )}
        <p>
          <strong>Opis:</strong> {product.description}
        </p>
        <p>
          <small>
            Dodano: {new Date(product.creationDate).toLocaleDateString("pl-PL")}
          </small>
        </p>
      </div>

      <hr />

      <h2>Komentarze</h2>

      {/* 🛠️ ZRZUT PAMIĘCI OBIEKTU USER */}
      <pre
        style={{
          background: "#222",
          color: "#0f0",
          padding: "15px",
          borderRadius: "5px",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>

      {/* 🛠️ LINIA DIAGNOSTYCZNA */}
      <div
        style={{
          backgroundColor: "#eee",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <strong>Profilaktyka:</strong> Zalogowany jako:{" "}
        <code>{JSON.stringify(user)}</code>
      </div>

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
                // 🧠 Wyciągamy login z obiektu user bez względu na to, jak nazwał go backend
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
                      {new Date(comment.creationDate).toLocaleDateString(
                        "pl-PL"
                      )}
                    </TableCell>

                    <TableCell>
                      {comment.creatorUserName}
                      <div style={{ fontSize: "10px", color: "gray" }}>
                        Porównanie: {loggedInUser || "brak"} VS{" "}
                        {comment.creatorUserName}
                      </div>
                    </TableCell>

                    <TableCell>
                      {editingCommentId === comment.id ? (
                        <>
                          <button
                            onClick={() => handleCommentEditSubmit(comment.id)}
                          >
                            Zapisz
                          </button>
                          <button onClick={() => setEditingCommentId(null)}>
                            Anuluj
                          </button>
                        </>
                      ) : (
                        // Porównujemy bezpiecznie wyciągnięty login z autorem komentarza
                        loggedInUser &&
                        loggedInUser.toLowerCase() ===
                          comment.creatorUserName?.toLowerCase() && (
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