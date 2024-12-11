import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // Importar toast y ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importar los estilos de react-toastify
import "./Register.css";

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("operario");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { username, email, password, role };

    try {
      const response = await fetch("https://cafito.onrender.com/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al registrar el usuario");
      }

      const data = await response.json();

      toast.success("Registro exitoso. ¡Bienvenido!"); // Mostrar mensaje de éxito
      setUser(data); // Guardar los datos del usuario
    } catch (err) {
      toast.error(err.message); // Mostrar mensaje de error
    }
  };

  return (
    <div>
      <h1>Registrar</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Eliminar los mensajes de error o éxito anteriores */}
          {/* No es necesario mostrar los mensajes aquí, ahora usamos Toastify */}

          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="operario">Operario</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Confirmar
          </button>
        </form>
      </div>

      {/* Contenedor de Toastify para mostrar las notificaciones */}
      <ToastContainer />
    </div>
  );
};

export default Register;
