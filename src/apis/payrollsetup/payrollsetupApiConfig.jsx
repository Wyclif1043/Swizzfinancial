import axios from "axios";

const API_URL = "https://d6115c4ab05b.ngrok-free.app/api";

const payrollsetupApiConfig = axios.create(
    {
        baseURL: API_URL,
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
        }
    }
)

export default payrollsetupApiConfig;