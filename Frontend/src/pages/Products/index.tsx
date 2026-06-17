import { Navigate, useParams } from "react-router-dom";
import { ProductType } from "../../types/products";
import { useCallback, useEffect, useState } from "react";
import { getProductById } from "../../store/products";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  const getProduct = useCallback(async () => {
    if (!id) return;

    try {
      const data: ProductType | null = await getProductById(id);
      setProduct(data);
    } finally {
      setLoaded(true);
    }
  }, [id]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  if (!loaded) {
    return <div>Loading...</div>;
  }
  if (!product) {
    return <Navigate to="/" replace />;
  }
  console.log(product);
  return (
    <div>
      <h1>Product Details</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Creation Date</TableCell>
              <TableCell align="right">User</TableCell>
              <TableCell align="right">Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={product.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{product.id}</TableCell>
              <TableCell align="right">{product.title}</TableCell>
              <TableCell align="right">{product.description}</TableCell>
              <TableCell align="right">
                {new Date(product.creationDate).toLocaleDateString("pl-PL")}
              </TableCell>
              <TableCell align="right">{product.creatorUserName}</TableCell>
              <TableCell align="right">
                <img src={product.imageUrl} alt={product.title} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6}>
                <h2>Categories</h2>
              </TableCell>
            </TableRow>
            {product.categories.map((category) => (
              <TableRow key={category}>
                <TableCell colSpan={6}>{category}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={6}>
                <h2>Comments</h2>
              </TableCell>
            </TableRow>
            {product.comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell colSpan={4}>{comment.description}</TableCell>
                <TableCell>
                  {new Date(comment.creationDate).toLocaleDateString("pl-PL")}
                </TableCell>
                <TableCell>{comment.creatorUserName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
