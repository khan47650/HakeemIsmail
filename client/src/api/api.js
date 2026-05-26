import axios from "axios";

const api = axios.create({
    baseURL: "https://api.hakeem-ismail.com",
});

export default api;