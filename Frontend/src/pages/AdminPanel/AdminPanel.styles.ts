export const styles = {
  pageWrapper: {
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "#d1d5db",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  card: {
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "1000px"
  },
  header: {
    color: "#8415b2",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "24px",
    textAlign: "center"
  },
  alertBox: {
    marginBottom: "20px"
  },
  tableContainer: {
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    marginTop: "16px"
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
  selectField: {
    minWidth: "120px",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#8415b2"
    }
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh",
    color: "#333"
  },
  accessDeniedCard: {
    padding: "40px",
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    maxWidth: "500px",
    margin: "40px auto"
  }
};