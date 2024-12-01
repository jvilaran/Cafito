import React, { useState, useEffect } from "react";
import axios from "axios";

const DetalleVenta = ({ ventaId }) => {
  const [venta, setVenta] = useState(null);

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/ventas/${ventaId}`
        );
        setVenta(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles de la venta", error);
      }
    };

    fetchVenta();
  }, [ventaId]);

  if (!venta) return <div>Cargando detalles...</div>;

  return (
    <div>
      <h3>Detalles de la Venta</h3>
      <p>Factura: {venta.numero_factura}</p>
      <p>Producto: {venta.producto}</p>
      <p>Cantidad: {venta.cantidad}</p>
      <p>Total: ${venta.total}</p>
      <p>Propina: ${venta.propina || 0}</p>
      <p>Total con Propina: ${venta.total_con_propina}</p>
    </div>
  );
};

export default DetalleVenta;
