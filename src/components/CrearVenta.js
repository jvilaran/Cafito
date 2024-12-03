import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateProduct.css";
import "./Checkbox.css";

const CrearVenta = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [conPropina, setConPropina] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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

    if (!productoSeleccionado) {
      setError("Por favor, seleccione un producto.");
      return;
    }

    // Asegurarse de que la cantidad es un número
    const cantidadNumerica = parseInt(cantidad, 10);

    // Obtener el precio del producto seleccionado
    const producto = productos.find(
      (p) => p.id === parseInt(productoSeleccionado)
    );

    // Calcular la propina
    const totalSinPropina = producto.precio * cantidadNumerica;
    const propina = conPropina ? totalSinPropina * 0.1 : 0;

    // Datos para enviar al backend
    const ventaData = {
      producto: productoSeleccionado,
      cantidad: cantidadNumerica,
      propina: propina.toFixed(2),
    };

    // Enviar la solicitud POST
    axios
      .post("http://127.0.0.1:8000/ventas/nueva/", ventaData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert(
          `Venta registrada con éxito. Número de factura: ${response.data.numero_factura}`
        );
        setError("");
      })
      .catch((error) => {
        setError("Error al registrar la venta. Intente nuevamente.");
        console.log("Error al registrar la venta:", error);
      });
  };

  return (
    <div>
      <h1>Crear Venta</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Selección de producto */}
          <div className="form-group">
            <label htmlFor="producto">Producto</label>
            <select
              id="producto"
              value={productoSeleccionado}
              onChange={handleProductoChange}
              required
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre} - {producto.precio}
                </option>
              ))}
            </select>
          </div>

          {/* Entrada de cantidad */}
          <div className="form-group">
            <label htmlFor="cantidad">Cantidad</label>
            <input
              id="cantidad"
              name="cantidad"
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              placeholder="Ingrese la cantidad"
              required
            />
          </div>

          {/* Propina opcional */}
          <div className="form-group">
            <label htmlFor="propina">
              Agregar propina{" "}
              <div className="checkbox-wrapper">
                <input
                  id="propina"
                  type="checkbox"
                  checked={conPropina}
                  onChange={(e) => setConPropina(e.target.checked)}
                />
                <span className="custom-checkbox"></span>
              </div>
            </label>
          </div>

          {/* Mostrar el error si lo hay */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Botón de envío */}
          <button type="submit" className="submit-button">
            Registrar Venta
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearVenta;
