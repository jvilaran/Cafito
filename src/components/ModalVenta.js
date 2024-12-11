import React, { useEffect, useState } from "react";
import { Printer, Text, Line, Cut } from "react-thermal-printer";

const ModalVenta = ({ venta, cerrarModal }) => {
  // Estado para controlar la impresión
  const [isPrinting, setIsPrinting] = useState(false);

  // Función para formatear la fecha y hora
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleString();
  };

  // Función para imprimir la venta
  const imprimirFactura = async () => {
    setIsPrinting(true); // Activar estado de impresión
    try {
      const recibo = `
        Recibo de Venta
        --------------------
        Fecha y hora: ${formatearFecha(venta.fecha)}
        Factura: ${venta.numero_factura}
        Detalles:
        ${venta.detalles
          .map(
            (detalle) =>
              `${detalle.producto_nombre} x${detalle.cantidad} $${detalle.precio}`
          )
          .join("\n")}
        --------------------
        Total: $${venta.total}
        Propina: $${venta.propina || 0}
      `;
      console.log(recibo); // Mostrar el recibo en la consola para depuración

      // Crear una instancia del ticket (para impresoras térmicas POS)
      const printer = new Printer();

      // Verifica si la impresora está disponible
      const isAvailable = await printer.isAvailable();
      if (!isAvailable) {
        alert("Impresora no disponible.");
        imprimirFacturaEnHTML(); // Si no hay impresora, se imprime en HTML
        return;
      }

      // Comienza a imprimir
      printer.append(
        <Text align="center" bold>
          Cafito Bar
        </Text>
      );
      printer.append(<Line />);

      printer.append(
        <Text align="left">
          Factura N°: {venta.numero_factura}
          {"\n"}
          Fecha: {formatearFecha(venta.fecha)}
        </Text>
      );
      printer.append(<Line />);

      venta.detalles.forEach((detalle) => {
        printer.append(
          <Text align="left">
            {detalle.producto_nombre} x{detalle.cantidad} ${detalle.subtotal}
          </Text>
        );
      });

      printer.append(<Line />);
      printer.append(
        <Text align="right">
          Total: ${venta.total}
          {"\n"}
          Propina: ${venta.propina}
        </Text>
      );
      printer.append(<Line />);
      printer.append(<Text align="center">¡Gracias por su compra!</Text>);
      printer.append(<Cut />);

      // Enviar el contenido a la impresora POS
      await printer.print();
      setIsPrinting(false); // Desactivar estado de impresión después de imprimir
    } catch (error) {
      console.error("Error al imprimir:", error);
      alert("Hubo un problema al imprimir.");
      setIsPrinting(false); // Desactivar estado de impresión en caso de error
    }
  };

  // Función para imprimir la factura en HTML (si no hay impresora conectada)
  const imprimirFacturaEnHTML = () => {
    const ventana = window.open("", "_blank");
    ventana.document.write(`
      <h1>Factura N°: ${venta.numero_factura}</h1>
      <p>Fecha y hora: ${formatearFecha(venta.fecha)}</p>
      <ul>
        ${venta.detalles
          .map(
            (detalle) =>
              `<li>${detalle.producto_nombre} x${detalle.cantidad} $${detalle.precio}</li>`
          )
          .join("")}
      </ul>
      <p><strong>Total:</strong> $${venta.total}</p>
      <p><strong>Propina:</strong> $${venta.propina}</p>
      <p><strong>Gracias por su compra!</strong></p>
    `);
    ventana.print();
    ventana.close();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Detalles de la venta {venta.numero_factura}</h2>
        <p>
          <strong>Fecha y hora de la venta:</strong>{" "}
          {formatearFecha(venta.fecha)}
        </p>
        <ul>
          {venta.detalles.map((detalle, index) => (
            <li key={index}>
              <strong>{detalle.producto_nombre}</strong> - {detalle.cantidad} x
              ${detalle.precio} = ${detalle.subtotal}
            </li>
          ))}
        </ul>
        <p>
          <strong>Total venta:</strong> ${venta.total}
        </p>
        <p>
          <strong>Propina:</strong> ${venta.propina || 0}
        </p>
        <button onClick={cerrarModal}>Cerrar</button>
        <button onClick={imprimirFactura} disabled={isPrinting}>
          {isPrinting ? "Imprimiendo..." : "Imprimir"}
        </button>
      </div>
    </div>
  );
};

export default ModalVenta;
