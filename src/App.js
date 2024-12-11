import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import ProductList from "./components/ProductList";
import CreateProduct from "./components/CreateProduct";
import EditProduct from "./components/EditProduct";
import CrearVenta from "./components/CrearVenta";
import ListarVentas from "./components/ListarVentas";
import FiltroVentas from "./components/FiltroVentas";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

const NavBar = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirige al login después de cerrar sesión
  };

  return (
    user && (
      <nav>
        <Link to="/home">Inicio</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/productos/nuevo">Crear Producto</Link>
        <Link to="/ventas/nueva">Crear Venta</Link>
        <Link to="/ventas">Ventas</Link>
        <Link to="/register">Registrar usuario</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    )
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.access);
    setUser({ token: data.access });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const hasPermission = (role) => {
    if (!user) return false;
    return user.role === role || user.role === "admin";
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <NavBar user={user} logout={logout} />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home user={user} logout={logout} />} />
        <Route path="/login" element={<Login user={user} login={login} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <ProductList showActions={hasPermission("admin")} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productos/nuevo"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productos/:id/editar"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ventas"
          element={
            <ProtectedRoute>
              <ListarVentas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ventas/nueva"
          element={
            <ProtectedRoute>
              <CrearVenta />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ventas/filtro"
          element={
            <ProtectedRoute>
              <FiltroVentas />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
