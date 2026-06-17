import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components";
import ProductDetails from "./pages/Products";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />}  />
          <Route path="/products" element={<Navigate to="/" replace />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/register" element={<RegisterPage />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
