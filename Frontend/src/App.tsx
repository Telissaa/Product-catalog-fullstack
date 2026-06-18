import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProductDetails from "./pages/Products";
import { AuthProvider } from "./components/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import CategoryPanel from "./pages/CategoryPanel";
import DeletedProducts from "./pages/DeletedProducts";
import AddProduct from "./pages/AddProducts";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Navigate to="/" replace />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/api/Auth/login" element={<Login />} />
            <Route path="/api/Auth/register" element={<Register />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/admin/users" element={<AdminPanel />} />
            <Route path="/admin/categories" element={<CategoryPanel />} />
            <Route
              path="/admin/deleted-products"
              element={<DeletedProducts />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
