import axios from "axios";

const API_BASE = "http://localhost:8000";

const api = axios.create({
  baseURL: `http://localhost:8000/`,
});

export const setAuthToken = (token) => {

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getTasks = () => api.get("/tasks");
export const createTask = (data) => api.post("/tasks/to-do", data);
export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;
