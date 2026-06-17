import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components";
import ProductDetails from "./pages/Products";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import AdminUsers from "./pages/AdminUsers";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Ładowanie uprawnień...</div>;
  }

  // Jeśli użytkownik nie jest zalogowany LUB nie jest adminem -> powrót do Home
  if (!user || user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div>
          <Routes>
            {}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Navigate to="/" replace />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            
            {}
            <Route path="/api/Auth/login" element={<Login />} />
            <Route path="/api/Auth/register" element={<Register />} />

            {/* 🔥 NOWA ŚCIEŻKA: Panel zarządzania rolami użytkowników (Punkt 3.c na ocenę 5)
                Dostępna TYLKO dla Admina dzięki owinięciu w <AdminRoute> */}
            {/* <Route 
              path="/admin/users" 
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } 
            /> */}

            {}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;