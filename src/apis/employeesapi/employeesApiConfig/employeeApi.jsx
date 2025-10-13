import axios from "axios";

const API_BASE_URL = "https://63e9030f26e2.ngrok-free.app/api";

const employeeApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true" 
  },
});

export default employeeApi;
