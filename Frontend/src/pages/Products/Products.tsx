import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { ProductType } from "../../types/types";

export default function Products() {
  const [rows, setRows] = useState<ProductType[]>([]);

  const getProducts = async () => {
    const response = await fetch("http://localhost:5249/api/products");
    const data = await response.json();
    setRows(data);
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
              <TableCell align="right">Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{row.id}</TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">
                  {row.isDeleted ? "Yes" : "No"}
                </TableCell>
                <TableCell align="right">{row.creationDate}</TableCell>
                <TableCell align="right">{row.creationUserId}</TableCell>
                <TableCell align="right">{row.imageUrl}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
