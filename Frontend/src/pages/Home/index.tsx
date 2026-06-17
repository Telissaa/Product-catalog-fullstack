import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { ProductType } from "../../types/products";
import { getProductsData } from "../../store/products";
import { Link } from "react-router-dom";

export default function Home() {
  const [rows, setRows] = useState<ProductType[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const getProducts = async () => {
    const data = await getProductsData();
    if (!data) return;

    const { products, pageNumber, pageSize, totalCount, totalPages } = data;
    setRows(products);
    setPageNumber(pageNumber);
    setPageSize(pageSize);
    setTotalCount(totalCount);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Is Deleted</TableCell>
              <TableCell align="right">Creation Date</TableCell>
              <TableCell align="right">User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{row.id}</TableCell>
                <TableCell align="right">
                  <Link to={`/products/${row.id}`}>{row.title}</Link>
                </TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">
                  {row.isDeleted ? "Yes" : "No"}
                </TableCell>
                <TableCell align="right">
                  {new Date(row.creationDate).toLocaleDateString("pl-PL")}
                </TableCell>
                <TableCell align="right">{row.creatorUserName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
