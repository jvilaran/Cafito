import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Importa Toastify
import "react-toastify/dist/ReactToastify.css"; // Importa los estilos

const CrearProducto = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación simple
    if (!nombre || !descripcion || !precio || !stock) {
      toast.error("Todos los campos son obligatorios."); // Mensaje de error
      return;
    }

    // Crear los datos del producto
    const productoData = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock, 10),
    };

    // Enviar datos al backend
    axios
      .post("https://cafito.onrender.com/api/productos/", productoData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        toast.success("Producto creado con éxito."); // Mensaje de éxito
        // Limpiar el formulario
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setStock("");
      })
      .catch((error) => {
        toast.error("Error al crear el producto. Intente nuevamente."); // Mensaje de error
        console.error("Error al crear el producto:", error.response || error);
      });
  };

  return (
    <div>
      <h1>Crear Producto</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Precio */}
          <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input
              type="number"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          {/* Stock */}
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              required
            />
          </div>

          {/* Botón de envío */}
          <button type="submit" className="submit-button">
            Crear Producto
          </button>
        </form>
      </div>

      {/* Contenedor de Toastify */}
      <ToastContainer />
    </div>
  );
};

export default CrearProducto;
