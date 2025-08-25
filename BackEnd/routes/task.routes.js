const express = require('express');
const { createTask, getTasks, getTaskById, getTasksByBoard, updateTask, deleteTask } = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware');

const taskRouter = express.Router();

taskRouter.post("/", auth, createTask);
taskRouter.get("/", auth, getTasks);  
taskRouter.get("/:id", auth, getTaskById);
taskRouter.put("/:id", auth, updateTask); 
taskRouter.delete("/:id", auth, deleteTask);
taskRouter.get("/board/:boardId", auth, getTasksByBoard);

module.exports = taskRouter;