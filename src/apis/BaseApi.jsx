import axios from "axios";

const BASE_URL= "https://d6115c4ab05b.ngrok-free.app/api";

const Base_Url = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        
    },
})

export default Base_Url;