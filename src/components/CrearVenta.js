import React, { useState, useEffect } from "react";
import axios from "axios";

const CrearVenta = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [propina, setPropina] = useState(0);
  const [conPropina, setConPropina] = useState(false);

  useEffect(() => {
    // Obtener productos al cargar el componente
    axios
      .get("http://127.0.0.1:8000/api/productos/")
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => console.log("Error al obtener productos:", error));
  }, []);

  const handleProductoChange = (e) => {
    setProductoSeleccionado(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ventaData = {
      producto: productoSeleccionado,
      cantidad: cantidad,
      propina: conPropina ? propina : 0,
    };

    axios
      .post("http://127.0.0.1:8000/api/ventas/nueva", ventaData)
      .then((response) => {
        alert(
          `Venta registrada con éxito. Número de factura: ${response.data.numero_factura}`
        );
      })
      .catch((error) => console.log("Error al registrar la venta:", error));
  };

  return (
    <div>
      <h2>Crear Venta</h2>
      <form onSubmit={handleSubmit}>
        {/* Selección de producto */}
        <label>
          Producto:
          <select
            value={productoSeleccionado}
            onChange={handleProductoChange}
            required
          >
            <option value="">Seleccione un producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre} - ${producto.precio}
              </option>
            ))}
          </select>
        </label>

        {/* Entrada de cantidad */}
        <label>
          Cantidad:
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            min="1"
            required
          />
        </label>

        {/* Propina opcional */}
        <label>
          ¿Agregar propina?
          <input
            type="checkbox"
            checked={conPropina}
            onChange={(e) => setConPropina(e.target.checked)}
          />
        </label>

        {conPropina && (
          <label>
            Propina:
            <input
              type="number"
              value={propina}
              onChange={(e) => setPropina(e.target.value)}
              min="0"
              step="0.01"
            />
          </label>
        )}

        {/* Botón de envío */}
        <button type="submit">Registrar Venta</button>
      </form>
    </div>
  );
};

export default CrearVenta;
