import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    withCredentials: true,
});

export default http;
