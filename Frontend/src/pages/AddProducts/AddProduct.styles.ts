export const styles = {
  pageWrapper: {
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "#d1d5db",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px"
  },
  card: {
    padding: "40px 30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "600px"
  },
  header: {
    color: "#8415b2",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "24px",
    textAlign: "center"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  textField: {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: "#8415b2"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#8415b2"
    }
  },
  categorySection: {
    display: "flex",
    flexDirection: "column",
    gap: 1
  },
  categoryHeaderBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  categoryLabel: {
    fontWeight: "bold",
    color: "#333",
    fontSize: "15px"
  },
  toggleCategoryBtn: {
    textTransform: "none",
    fontWeight: "bold",
    color: "#20B6F3",
    "&:hover": {
      backgroundColor: "rgba(32, 182, 243, 0.1)"
    }
  },
  newCategoryBox: {
    p: 2,
    border: "1px dashed #8415b2",
    borderRadius: "8px",
    backgroundColor: "#faf5ff",
    mb: 2
  },
  newCategoryLabel: {
    margin: "0 0 8px 0",
    fontSize: "13px",
    color: "#555"
  },
  newCategoryInputBox: {
    display: "flex",
    gap: 2
  },
  btnSuccess: {
    backgroundColor: "#69d738",
    color: "#ffffff",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#5bc22e" }
  },
  btnPrimary: {
    backgroundColor: "#8415b2",
    color: "#ffffff",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#6a1090" }
  },
  btnCancel: {
    borderColor: "#333",
    color: "#333",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#f4f7fa" }
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    marginTop: "10px"
  }
};