import { useState } from "react";
import {BrowserRouter,Routes,Route,} from "react-router-dom";
import GlobalNavbar from "./components/GlobalNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import OrderSuccess from "./pages/OrderSuccess";

import { Toaster } from "react-hot-toast";

export default function App() {
  const [SearchValue, setSearchValue] = useState("");

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <GlobalNavbar
        SearchValue={SearchValue}
        setSearchValue={setSearchValue}
      />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Products */}
        <Route
          path="/products"
          element={<Products SearchValue={SearchValue} />}
        />

        <Route
          path="/products/category/:category"
          element={<Products SearchValue={SearchValue} />}
        />

        {/* Product Details */}
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* Order Success */}
        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Customer Profile */}
        <Route element={<ProtectedRoute allowedRole="customer" />}>
          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}