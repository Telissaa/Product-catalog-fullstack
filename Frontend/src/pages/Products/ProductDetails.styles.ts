export const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#d1d5db",
    padding: "40px 0"
  },
  mainCard: {
    p: 4,
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    mb: 4
  },
  productTitle: {
    color: "#8415b2",
    fontWeight: 800,
    mb: 3,
    textTransform: "uppercase"
  },
  productImage: {
    maxWidth: "100%",
    width: "400px",
    borderRadius: "8px",
    marginBottom: "20px",
    objectFit: "cover" as const,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
  },
  detailText: {
    fontSize: "16px",
    color: "#333",
    mb: 1.5
  },
  chip: {
    backgroundColor: "#8415b2",
    color: "#ffffff",
    fontWeight: "bold",
    mr: 1,
    mb: 1
  },
  adminActionBox: {
    display: "flex",
    gap: 2,
    mt: 3,
    pt: 3,
    borderTop: "1px solid #eee"
  },
  btnEditInfo: {
    backgroundColor: "#20B6F3",
    color: "#ffffff",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#1aa3db" }
  },
  btnDeleteWarning: {
    backgroundColor: "#f35e20",
    color: "#ffffff",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#d14c16" }
  },
  btnSuccess: {
    backgroundColor: "#69d738",
    color: "#ffffff",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#5bc22e" }
  },
  btnCancel: {
    borderColor: "#333",
    color: "#333",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#f4f7fa" }
  },
  btnPrimary: {
    backgroundColor: "#8415b2",
    color: "#ffffff",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#6a1090" }
  },
  editModalCard: {
    border: "2px solid #20B6F3",
    p: 3,
    borderRadius: "8px",
    backgroundColor: "#f9fcff",
    mb: 4
  },
  sectionTitle: {
    color: "#333",
    fontWeight: 700,
    mb: 3,
    mt: 4
  },
  tableContainer: {
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
  },
  tableHead: {
    backgroundColor: "#8415b2"
  },
  tableHeadCell: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "15px"
  },
  tableRow: {
    "&:last-child td, &:last-child th": { border: 0 },
    "&:hover": { backgroundColor: "#f4f7fa" },
    transition: "background-color 0.2s ease"
  },
  actionCell: {
    display: "flex",
    gap: 1
  },
  commentFormCard: {
    border: "2px solid #8415b2",
    p: 3,
    borderRadius: "8px",
    backgroundColor: "#faf5ff",
    mt: 3
  }
};