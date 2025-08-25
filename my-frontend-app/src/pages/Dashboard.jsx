import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const navigate = useNavigate();

  // Fetch boards on component mount
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/boards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(res.data);
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };

  // Create a new board
  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/boards",
        { title: newBoardTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewBoardTitle("");  // clear input
      fetchBoards();         // refresh boards list
    } catch (err) {
      console.error("Error creating board:", err);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {user?.name || user?.email} 👋</h1>
      <p>You are logged in as: <strong>{user?.role}</strong></p>

      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      <hr />

      <h2>Create New Board</h2>
      <input
        type="text"
        placeholder="Board title"
        value={newBoardTitle}
        onChange={(e) => setNewBoardTitle(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={handleCreateBoard}>Create Board</button>

      <h2 style={{ marginTop: "20px" }}>Your Boards</h2>
      {boards.length === 0 ? (
        <p>No boards yet. Create one!</p>
      ) : (
        <ul>
          {boards.map((board) => (
            <li
              key={board._id}
              style={{ cursor: "pointer", margin: "8px 0" }}
              onClick={() => navigate(`/boards/${board._id}`)}
            >
              {board.title} {/* ✅ matches backend */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
