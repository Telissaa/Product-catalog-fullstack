export const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#d1d5db", // Zmiana na wyraźniejsze, ciemniejsze tło
    padding: "40px 0"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px"
  },
  header: {
    color: "#8415b2",
    fontWeight: 800,
    mb: 4,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "2px"
  },
  filterCard: {
    p: 3,
    mb: 4,
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    display: "flex",
    gap: 2,
    alignItems: "center",
    flexWrap: "wrap",
    borderTop: "4px solid #f35e20"
  },
  searchBox: {
    display: "flex",
    gap: 1,
    flexGrow: 1,
    minWidth: "250px"
  },
  searchInput: {
    backgroundColor: "white",
    '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#8415b2' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#8415b2' }
  },
  searchButton: {
    backgroundColor: "#f35e20",
    color: "white",
    fontWeight: "bold",
    '&:hover': { backgroundColor: "#d14c16" }
  },
  formControl: {
    minWidth: 180,
    backgroundColor: "white"
  },
  inputLabel: {
    '&.Mui-focused': { color: '#8415b2' }
  },
  select: {
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8415b2' }
  },
  clearButton: {
    ml: "auto",
    color: "#8415b2",
    borderColor: "#8415b2",
    fontWeight: "bold",
    '&:hover': {
      backgroundColor: "rgba(132, 21, 178, 0.08)",
      borderColor: "#8415b2"
    }
  },
  tableContainer: {
    borderRadius: "12px",
    overflow: "hidden"
  },
  tableHead: {
    backgroundColor: "#8415b2"
  },
  tableHeadCell: {
    color: "white",
    fontWeight: "bold",
    fontSize: "16px"
  },
  tableRow: {
    "&:last-child td, &:last-child th": { border: 0 },
    "&:hover": { backgroundColor: "rgba(32, 182, 243, 0.05)" },
    transition: "background-color 0.2s ease"
  },
  tableCellId: {
    fontWeight: "bold",
    color: "#555"
  },
  productLink: {
    textDecoration: "none",
    color: "#20B6F3",
    fontWeight: "bold",
    fontSize: "15px"
  },
  tableCellCategory: {
    color: "#333"
  },
  paginationWrapper: {
    display: "flex",
    justifyContent: "center",
    mt: 5,
    mb: 4
  },
  pagination: {
    '& .MuiPaginationItem-root': {
      color: '#333',
      fontWeight: 'bold',
    },
    '& .Mui-selected': {
      backgroundColor: '#f35e20 !important',
      color: 'white',
    },
    '& .MuiPaginationItem-root:hover': {
      backgroundColor: 'rgba(243, 94, 32, 0.2)',
    }
  }
};