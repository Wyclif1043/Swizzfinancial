import axios from "axios";

const BASE_URL= "https://63e9030f26e2.ngrok-free.app/api";

const Base_Url = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        
    },
})

export default Base_Url;