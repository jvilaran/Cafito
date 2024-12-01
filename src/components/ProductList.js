import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Solicitar los productos desde la API
    axios
      .get("http://127.0.0.1:8000/api/productos/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los productos:", error);
      });
  }, []);

  const deleteProduct = (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      axios
        .delete(`http://127.0.0.1:8000/api/productos/${id}/`)
        .then(() => {
          setProducts(products.filter((product) => product.id !== id));
        })
        .catch((error) => {
          console.error("Hubo un error al eliminar el producto:", error);
        });
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const saveProduct = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api/productos/${selectedProduct.id}/`,
        selectedProduct
      )
      .then((response) => {
        setProducts(
          products.map((product) =>
            product.id === selectedProduct.id ? response.data : product
          )
        );
        setShowModal(false);
        alert("El producto fue actualizado con éxito");
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el producto", error);
      });
  };

  return (
    <div>
      <h1>Lista de Productos</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.nombre}</td>
              <td>${product.precio}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => openEditModal(product)}>Editar</button>
                <button onClick={() => deleteProduct(product.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ventana emergente para editar */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Producto</h2>
            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={selectedProduct.nombre}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Precio:
              <input
                type="number"
                name="precio"
                value={selectedProduct.precio}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Stock:
              <input
                type="number"
                name="stock"
                value={selectedProduct.stock}
                onChange={handleInputChange}
              />
            </label>
            <button onClick={saveProduct}>Guardar Cambios</button>
            <button onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
