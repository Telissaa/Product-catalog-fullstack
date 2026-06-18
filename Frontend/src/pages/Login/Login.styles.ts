export const styles = {
  pageWrapper: {
    minHeight: "calc(100vh - 64px)", // Odliczenie wysokości paska nawigacji
    backgroundColor: "#d1d5db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  },
  card: {
    padding: "40px 30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    width: "100%"
  },
  header: {
    color: "#8415b2",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "24px"
  },
  form: {
    width: "100%",
    marginTop: "8px"
  },
  textField: {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: "#8415b2"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#8415b2"
    }
  },
  submitButton: {
    marginTop: "24px",
    marginBottom: "16px",
    backgroundColor: "#8415b2",
    color: "#ffffff",
    fontWeight: "bold",
    padding: "10px 0",
    "&:hover": {
      backgroundColor: "#6a1090"
    },
    "&:disabled": {
      backgroundColor: "rgba(132, 21, 178, 0.5)",
      color: "#ffffff"
    }
  },
  linkContainer: {
    textAlign: "center",
    marginTop: "16px"
  },
  linkText: {
    color: "#333",
    fontSize: "14px"
  },
  linkAction: {
    color: "#20B6F3",
    textDecoration: "none",
    fontWeight: "bold",
    "&:hover": {
      textDecoration: "underline"
    }
  }
};