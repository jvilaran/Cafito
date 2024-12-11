import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = ({ user, logout }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("https://cafito.onrender.com/usuario/actual/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener los datos del usuario");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No se pudieron cargar los datos del usuario.</div>;
  }

  return (
    <div className="home_background">
      <h1>Bienvenid@, {userData.username}!</h1>
      <div>
        <div>
          <h2>Información de tu cuenta</h2>
        </div>
        <div className="text">
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Rol:</strong> {userData.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
