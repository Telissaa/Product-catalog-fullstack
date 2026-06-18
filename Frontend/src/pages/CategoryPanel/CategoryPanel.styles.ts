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
    maxWidth: "800px"
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
  addForm: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    alignItems: "center"
  },
  textField: {
    flexGrow: 1,
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: "#8415b2"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#8415b2"
    }
  },
  btnPrimary: {
    backgroundColor: "#8415b2",
    color: "#ffffff",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    "&:hover": { backgroundColor: "#6a1090" }
  },
  btnSuccess: {
    backgroundColor: "#69d738",
    color: "#ffffff",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#5bc22e" }
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
  btnCancel: {
    borderColor: "#333",
    color: "#333",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#f4f7fa" }
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
    gap: "8px"
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