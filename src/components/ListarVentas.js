import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ListarVentas.css";
import ModalVenta from "./ModalVenta"; // Importar el nuevo componente ModalVenta

const ListarVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const obtenerVentas = async () => {
    const url =
      fechaInicio && fechaFin
        ? `https://cafito.onrender.com/filtrar/?inicio=${fechaInicio}&fin=${fechaFin}`
        : "https://cafito.onrender.com/ventas/listar/";

    const response = await axios.get(url);
    setVentas(response.data);
  };

  const verDetalles = async (numeroFactura) => {
    const response = await axios.get(
      `https://cafito.onrender.com/ventas/${numeroFactura}/`
    );
    setVentaSeleccionada(response.data);
  };

  const cerrarModal = () => {
    setVentaSeleccionada(null); // Esto cierra el modal
  };

  useEffect(() => {
    obtenerVentas();
  }, [fechaInicio, fechaFin]);

  return (
    <div className="sell">
      <h1>Ventas</h1>
      <div className="filtro-fechas">
        <label>
          Fecha inicio:
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>
        <label>
          Fecha fin:
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </label>
        <button onClick={obtenerVentas}>Filtrar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Factura</th>
            <th>Total</th>
            <th>Propina</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.numero_factura}>
              <td>{venta.numero_factura}</td>
              <td>${venta.total}</td>
              <td>${venta.propina || 0}</td>
              <td>
                <button onClick={() => verDetalles(venta.numero_factura)}>
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ventaSeleccionada && (
        <ModalVenta venta={ventaSeleccionada} cerrarModal={cerrarModal} />
      )}
    </div>
  );
};

export default ListarVentas;
