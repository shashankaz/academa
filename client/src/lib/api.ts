import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL + "/api/v1";

const api = axios.create({
  withCredentials: true,
});

export { api };
