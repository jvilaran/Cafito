import React, { useState } from "react";


const FiltroVentas = ({ onFilter }) => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(fechaInicio, fechaFin);
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Filtrar</button>
    </form>
  );
};

export default FiltroVentas;
