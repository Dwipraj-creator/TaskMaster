import API from "./axios";

/**
 * Create a new comment
 * @param {string} taskId
 * @param {object} commentData - { content, mentions: [userId1, userId2, ...] }
 */
export const createComment = async (taskId, commentData) => {
  try {
    const res = await API.post("/comments", { taskId, ...commentData });
    return res.data;
  } catch (err) {
    console.error("Error creating comment:", err);
    throw err;
  }
};

/**
 * Get all comments for a specific task
 * @param {string} taskId
 */
export const getTaskComments = async (taskId) => {
  try {
    const res = await API.get(`/comments/${taskId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw err;
  }
};

/**
 * Update a comment
 * @param {string} commentId
 * @param {object} updatedData - { content, mentions: [] }
 */
export const updateComment = async (commentId, updatedData) => {
  try {
    const res = await API.put(`/comments/${commentId}`, updatedData);
    return res.data;
  } catch (err) {
    console.error("Error updating comment:", err);
    throw err;
  }
};

/**
 * Delete a comment
 * @param {string} commentId
 */
export const deleteComment = async (commentId) => {
  try {
    const res = await API.delete(`/comments/${commentId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting comment:", err);
    throw err;
  }
};
