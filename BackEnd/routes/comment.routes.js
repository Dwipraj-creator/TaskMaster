const express = require("express");
const CommentRouter = express.Router();

const auth = require("../middleware/auth.middleware");
const { createComment,getTaskComments,updateComment,deleteComment } = require("../controllers/comment.controller");

// create comment
CommentRouter.post("/", auth,createComment);

// get comments for a task
CommentRouter.get("/:taskId", auth, getTaskComments);

// update comment
CommentRouter.put("/:commentId", auth, updateComment);

// delete comment
CommentRouter.delete("/:commentId", auth,deleteComment);

module.exports = CommentRouter;
