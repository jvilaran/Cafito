import React, { useState, useEffect } from "react";
import axios from "axios";

const BalanceVentas = () => {
  const [totalVentas, setTotalVentas] = useState(0);

  useEffect(() => {
    const obtenerBalance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/ventas/listar/"
        );
        const total = response.data.reduce(
          (acc, venta) => acc + venta.total_con_propina,
          0
        );
        setTotalVentas(total);
      } catch (error) {
        console.error("Error al obtener el balance de ventas", error);
      }
    };

    obtenerBalance();
  }, []);

  return (
    <div>
      <h3>Balance de Ventas</h3>
      <p>Total de Ventas: ${totalVentas.toFixed(2)}</p>
    </div>
  );
};

export default BalanceVentas;
