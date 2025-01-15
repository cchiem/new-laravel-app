import axios from "axios";

// Axios instance
const api = axios.create({
    baseURL: "http://127.0.0.1:8000", // Ensure this matches your server's base URL
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
