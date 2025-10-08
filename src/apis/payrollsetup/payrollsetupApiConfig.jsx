import axios from "axios";

const API_URL = "hhttps://9a6bce08489a.ngrok-free.app/api";

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