const express = require("express");
const auth = require("../middleware/auth.middleware");
const {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  addMember,
} = require("../controllers/board.controller");

const boardRouter = express.Router();

// All boardRouter are relative to /api/boards
boardRouter.post("/", auth, createBoard);           // Create board
boardRouter.get("/", auth, getBoards);             // Get all boards
boardRouter.get("/:id", auth, getBoardById);       // Get board by ID
boardRouter.put("/:id", auth, updateBoard);        // Update board
boardRouter.delete("/:id", auth, deleteBoard);     // Delete board
boardRouter.post("/:id/add-member", auth, addMember); // Add member

module.exports = boardRouter;
