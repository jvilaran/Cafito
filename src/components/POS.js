import React, { useEffect } from "react";
import { Printer, Text, Line, Cut } from "react-thermal-printer";

const ImprimirPOS = ({ venta }) => {
  // Asegúrate de que la venta sea un objeto antes de usarla
  useEffect(() => {
    if (venta && venta.detalles && venta.detalles.length > 0) {
      imprimirFactura(); // Llama a la función de impresión cuando 'venta' esté disponible
    } else {
      console.log("No hay detalles en la venta para imprimir");
    }
  }, [venta]); // Se ejecuta cada vez que 'venta' cambia

  const imprimirFactura = async () => {
    try {
      console.log(venta); // Asegúrate de que la 'venta' esté bien definida

      const recibo = `
        Recibo de Venta
        --------------------
        Fecha y hora: ${venta.fecha}
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
          Fecha: {new Date(venta.fecha).toLocaleString()}
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

      // Si la impresora no está disponible, mostrar la simulación
      if (!isAvailable) {
        const ventana = window.open("", "_blank");
        ventana.document.write(`
          <h1>Factura N°: ${venta.numero_factura}</h1>
          <p>Fecha y hora: ${new Date(venta.fecha).toLocaleString()}</p>
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
      }
    } catch (error) {
      console.error("Error al imprimir:", error);
      alert("Hubo un problema al imprimir.");
    }
  };

  // Si no se ha recibido la venta, mostramos un mensaje de carga
  if (!venta) {
    return <p>Selecciona una venta para imprimir.</p>;
  }

  return (
    <div>
      <h2>Factura N°: {venta.numero_factura}</h2>
      <p>Fecha y hora: {new Date(venta.fecha).toLocaleString()}</p>
      <ul>
        {venta.detalles.map((detalle, index) => (
          <li key={index}>
            {detalle.producto_nombre} - {detalle.cantidad} x ${detalle.precio} ={" "}
            ${detalle.subtotal}
          </li>
        ))}
      </ul>
      <p>Total: ${venta.total}</p>
      <p>Propina: ${venta.propina}</p>
    </div>
  );
};

export default ImprimirPOS;

/* import { Printer, Text, Line, Cut } from "react-thermal-printer";

const ImprimirPOS = (venta) => {
  const imprimirFactura = async () => {
    try {
      // Simula la impresión en la consola
      console.log("Imprimiendo factura...");
      console.log(`Factura N°: ${venta.numero_factura}`);
      console.log(`Fecha: ${new Date(venta.fecha).toLocaleString()}`);
      venta.detalles.forEach((detalle) => {
        console.log(
          `${detalle.producto_nombre} x${detalle.cantidad} $${detalle.precio}`
        );
      });
      console.log(`Total: $${venta.total}`);
      console.log(`Propina: $${venta.propina || 0}`);
      console.log("------------------------------");

      // Crear el contenido HTML para la impresión
      const ticketHtml = `
        <div style="text-align: center; font-family: Arial, sans-serif; padding: 10px;">
          <h2>Cafito Bar</h2>
          <hr />
          <p><strong>Factura N°:</strong> ${venta.numero_factura}</p>
          <p><strong>Fecha:</strong> ${new Date(
            venta.fecha
          ).toLocaleString()}</p>
          <hr />
          <ul style="text-align: left;">
            ${venta.detalles
              .map(
                (detalle) => `
              <li>${detalle.producto_nombre} x${detalle.cantidad} $${detalle.precio}</li>
            `
              )
              .join("")}
          </ul>
          <hr />
          <p><strong>Total:</strong> $${venta.total}</p>
          <p><strong>Propina:</strong> $${venta.propina || 0}</p>
          <hr />
          <p><strong>¡Gracias por su compra!</strong></p>
        </div>
      `;

      // Crear una nueva ventana para mostrar el recibo
      const ventana = window.open("", "_blank", "width=400, height=600");
      ventana.document.write(ticketHtml);
      ventana.document.close();

      // Simula la impresión del recibo (imprime la nueva ventana)
      ventana.print();
      ventana.close();
    } catch (error) {
      console.error("Error al imprimir:", error);
      alert("Hubo un problema al imprimir.");
    }
  };

  // Ejecutar la impresión cuando se pasa la venta
  imprimirFactura();

  return null;
};

export default ImprimirPOS;
 */