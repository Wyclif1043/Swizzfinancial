import axios from "axios";

const EMP_BASE_URL = "https://903e16ed1f65.ngrok-free.app/api"

const getemployeesapi = axios.create({
    baseURL: EMP_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",        
    }
})

export default getemployeesapi