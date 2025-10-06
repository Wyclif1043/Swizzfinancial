import axios from "axios";

const API_URL = "https://83d041a48c40.ngrok-free.app/api";

const fixedassetsApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default fixedassetsApi;
