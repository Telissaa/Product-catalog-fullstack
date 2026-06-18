export const styles = {
  appBar: {
    backgroundColor: "#8415b2",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)"
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    minHeight: "64px"
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: 1
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 2
  },
  navLink: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "14px",
    textTransform: "uppercase",
    padding: "6px 12px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(32, 182, 243, 0.1)",
      color: "#20B6F3"
    }
  },
  addLink: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "14px",
    textTransform: "uppercase",
    padding: "6px 16px",
    backgroundColor: "rgba(243, 94, 32, 0.8)",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f35e20"
    }
  },
  userInfo: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 500
  },
  logoutButton: {
    backgroundColor: "#f35e20",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "13px",
    padding: "6px 16px",
    "&:hover": {
      backgroundColor: "#d14c16"
    }
  },
  authLink: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "14px",
    textTransform: "uppercase",
    border: "1px solid #ffffff",
    padding: "4px 16px",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#8415b2"
    }
  }
};