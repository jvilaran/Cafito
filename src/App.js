import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import CreateProduct from "./components/CreateProduct";
import EditProduct from "./components/EditProduct";
import CrearVenta from "./components/CrearVenta";
import ListarVentas from "./components/ListarVentas";
import FiltroVentas from "./components/FiltroVentas";

const App = () => {
  return (
    <Router>
      <nav>
        <a href="/productos/nuevo">Crear Producto</a>
        <a href="/productos">Productos</a>
        <a href="/ventas/nueva">Crear Venta</a>
        <a href="/ventas">Ventas</a>
      </nav>
      <Routes>
        {/* Rutas de productos */}
        <Route path="/productos" element={<ProductList />} />
        <Route path="/productos/nuevo" element={<CreateProduct />} />
        <Route path="/productos/:id/editar" element={<EditProduct />} />

        {/* Rutas de ventas */}
        <Route path="/ventas" element={<ListarVentas />} />
        <Route path="/ventas/nueva" element={<CrearVenta />} />
        <Route path="/ventas/filtro" element={<FiltroVentas />} />
      </Routes>
    </Router>
  );
};

export default App;
