import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ListarVentas.css"

const ListarVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const obtenerVentas = async () => {
    const url =
      fechaInicio && fechaFin
        ? `http://localhost:8000/ventas/filtrar/?inicio=${fechaInicio}&fin=${fechaFin}`
        : "http://localhost:8000/ventas/listar/";

    const response = await axios.get(url);
    setVentas(response.data);
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  return (
    <div>
      <h1>Ventas</h1>
      <div className="filtro-fechas">
        <label>
          Fecha Inicio:
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>
        <label>
          Fecha Fin:
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
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Propina</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.numero_factura}>
              <td>{venta.numero_factura}</td>
              <td>{venta.nombre_producto}</td>
              <td>{venta.cantidad}</td>
              <td>${venta.propina || 0}</td>
              <td>${venta.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarVentas;
