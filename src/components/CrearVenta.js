import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Importar ToastContainer correctamente
import "react-toastify/dist/ReactToastify.css"; // Estilos para react-toastify
import "./CreateProduct.css";
import "./Checkbox.css";

const CrearVenta = () => {
  const [productos, setProductos] = useState([]);
  const [ventaProductos, setVentaProductos] = useState([]);
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

  const agregarProducto = () => {
    setVentaProductos([
      ...ventaProductos,
      { productoId: "", cantidad: 1 }, // Producto vacío por defecto
    ]);
  };

  const eliminarProducto = (index) => {
    setVentaProductos(ventaProductos.filter((_, i) => i !== index));
  };

  const handleProductoChange = (index, value) => {
    const nuevosProductos = [...ventaProductos];
    nuevosProductos[index].productoId = value;
    setVentaProductos(nuevosProductos);
  };

  const handleCantidadChange = (index, value) => {
    const nuevosProductos = [...ventaProductos];
    nuevosProductos[index].cantidad = parseInt(value, 10);
    setVentaProductos(nuevosProductos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (ventaProductos.some((p) => !p.productoId)) {
      setError("Por favor, seleccione un producto en cada fila.");
      toast.error("Por favor, seleccione un producto en cada fila."); // Toast de error
      return;
    }

    // Calcula el total sin propina
    const totalSinPropina = ventaProductos.reduce((total, item) => {
      const producto = productos.find(
        (p) => p.id === parseInt(item.productoId)
      );
      return total + (producto.precio * item.cantidad || 0);
    }, 0);

    const propina = conPropina ? totalSinPropina * 0.1 : 0;

    const ventaData = {
      productos: ventaProductos.map((item) => ({
        producto_id: item.productoId,
        cantidad: item.cantidad,
        precio:
          productos.find((p) => p.id === parseInt(item.productoId))?.precio ||
          0,
      })),
      propina: propina.toFixed(2),
    };

    axios
      .post("http://127.0.0.1:8000/ventas/nueva/", ventaData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        toast.success(
          `Venta registrada con éxito. Número de factura: ${response.data.numero_factura}`
        );
        setVentaProductos([]);
        setError("");
      })
      .catch((error) => {
        toast.error("Error al registrar la venta. Intente nuevamente.");
        console.log("Error al registrar la venta:", error.response || error);
      });
  };

  return (
    <div>
      <h1>Crear Venta</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Lista de productos */}
          {ventaProductos.map((venta, index) => (
            <div key={index} className="form-group">
              <label>Producto</label>
              <select
                value={venta.productoId}
                onChange={(e) => handleProductoChange(index, e.target.value)}
                required
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} - ${producto.precio}
                  </option>
                ))}
              </select>
              <label>Cantidad</label>
              <input
                type="number"
                value={venta.cantidad}
                onChange={(e) => handleCantidadChange(index, e.target.value)}
                min="1"
                required
              />
              <div className="form-group">
                <button
                  type="button"
                  onClick={() => eliminarProducto(index)}
                  className="delete-button"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={agregarProducto}
            className="add-button"
          >
            Agregar Producto
          </button>

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

      {/* Añadir el contenedor de los Toasts */}
      <ToastContainer />
    </div>
  );
};

export default CrearVenta;
