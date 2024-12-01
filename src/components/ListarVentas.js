import React, { useState, useEffect } from "react";
import axios from "axios";

const ListarVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const obtenerVentas = async () => {
    const url =
      fechaInicio && fechaFin
        ? `http://localhost:8000/api/ventas/filtrar/?inicio=${fechaInicio}&fin=${fechaFin}`
        : "http://localhost:8000/api/ventas/listar/";

    const response = await axios.get(url);
    setVentas(response.data);
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  return (
    <div>
      <h2>Ventas</h2>
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

      <table>
        <thead>
          <tr>
            <th>Factura</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Propina</th>
            <th>Total con Propina</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.numero_factura}>
              <td>{venta.numero_factura}</td>
              <td>{venta.producto}</td>
              <td>{venta.cantidad}</td>
              <td>${venta.total}</td>
              <td>${venta.propina || 0}</td>
              <td>${venta.total_con_propina}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarVentas;
