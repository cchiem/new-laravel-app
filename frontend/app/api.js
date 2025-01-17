import axios from "axios";
import { API_BASE_URL } from "@env"; // Correct import for environment variables

// Axios instance

const api = axios.create({
    baseURL: API_BASE_URL, // Using the environment variable for the base URL
    headers: {
        "Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
    },
});

export default api;
