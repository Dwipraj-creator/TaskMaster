// tasks.jsx
import API from "./axios";

export const createTask = async (boardId, taskData) => {
  const res = await API.post("/tasks", { boardId, ...taskData });
  return res.data;
};

export const getTasksByBoard = async (boardId) => {
  const res = await API.get(`/tasks/board/${boardId}`);
  return res.data;
};

export const updateTask = async (taskId, updatedData) => {
  const res = await API.put(`/tasks/${taskId}`, updatedData);
  return res.data;
};

export const deleteTask = async (taskId) => {
  const res = await API.delete(`/tasks/${taskId}`);
  return res.data;
};
