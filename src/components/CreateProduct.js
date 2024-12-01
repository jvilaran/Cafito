import React, { useState } from "react";
import api from "../api";
import "./CreateProduct.css";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("productos/", formData)
      .then(() => alert("Producto creado exitosamente"))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Agrega el producto</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              placeholder="Ingrese el nombre"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Descripción del producto"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input
              id="precio"
              name="precio"
              placeholder="Precio por unidad"
              type="number"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Cantidad</label>
            <input
              id="stock"
              name="stock"
              placeholder="Cantidad de productos"
              type="number"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-button">
            Crear Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
