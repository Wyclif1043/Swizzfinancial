import axios from "axios";

const API_BASE_URL = "https://d2688c26f810.ngrok-free.app/api";

const employeeApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true" 
  },
});

export default employeeApi;
