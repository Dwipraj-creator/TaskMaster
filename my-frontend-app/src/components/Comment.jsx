import React, { useState, useEffect } from "react";
import axios from "axios";

const Comments = ({ taskId, token }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch comments for this task
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/comments/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    if (taskId) fetchComments();
  }, [taskId]);

  // ✅ Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      await axios.post(
        `http://localhost:5000/api/comments`,
        { taskId, content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update comment
  const handleUpdateComment = async (commentId, content) => {
    try {
      await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCommentId(null);
      fetchComments();
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  // ✅ Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="comments">
      <h3>💬 Comments</h3>

      {/* Add new comment */}
      <div className="comment-input">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment} disabled={loading}>
          {loading ? "Posting..." : "Add Comment"}
        </button>
      </div>

      {/* List comments */}
      <ul>
        {comments.map((comment) => (
          <li key={comment._id} className="comment-item">
            {editingCommentId === comment._id ? (
              <div>
                <textarea
                  defaultValue={comment.content}
                  onBlur={(e) =>
                    handleUpdateComment(comment._id, e.target.value)
                  }
                />
              </div>
            ) : (
              <p>
                <strong>{comment.author?.name || "Unknown"}:</strong>{" "}
                {comment.content}
              </p>
            )}

            <div className="comment-actions">
              <button onClick={() => setEditingCommentId(comment._id)}>
                ✏️ Edit
              </button>
              <button onClick={() => handleDeleteComment(comment._id)}>
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
