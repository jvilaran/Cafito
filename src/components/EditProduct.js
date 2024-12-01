import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
  });

  useEffect(() => {
    api
      .get(`productos/${id}/`)
      .then((response) => setFormData(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .put(`productos/${id}/`, formData)
      .then(() => {
        alert("Producto actualizado");
        navigate("/productos");
      })
      .catch((error) => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Nombre"
      />
      <textarea
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
      />
      <input
        name="precio"
        value={formData.precio}
        onChange={handleChange}
        type="number"
        placeholder="Precio"
      />
      <input
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        type="number"
        placeholder="Stock"
      />
      <button type="submit">Actualizar Producto</button>
    </form>
  );
};

export default EditProduct;
