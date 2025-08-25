import API from "./axios";

// Get all boards for the logged-in user
export const getBoards = () => API.get("/boards");

// Create a new board
export const createBoard = (data) => API.post("/boards", data);

// Get a single board by ID
export const getBoardById = (id) => API.get(`/boards/${id}`);

// Update board info
export const updateBoard = (id, data) => API.put(`/boards/${id}`, data);

// Delete a board
export const deleteBoard = (id) => API.delete(`/boards/${id}`);

// Add a member to a board
export const addMember = (boardId, memberData) =>
  API.post(`/boards/${boardId}/add-member`, memberData);
