import axios from "axios";

// Axios instance
const api = axios.create({
    baseURL: "http://127.0.0.1:8000", // Ensure this matches your server's base URL
    headers: {
        "Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
    },
});

export default api;
