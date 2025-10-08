import axios from "axios";

const API_BASE_URL = "https://9a6bce08489a.ngrok-free.app/api";

const employeeApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true" 
  },
});

export default employeeApi;
