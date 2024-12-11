import axios from "axios";

const api = axios.create({
  baseURL: "https://cafito.onrender.com", // Ajusta la URL según tu configuración
});

export default api;
