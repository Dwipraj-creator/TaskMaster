const Comment = require("../models/comment.model");
const Task = require("../models/task.model");
const User = require("../models/user.model");

// ✅ Create a comment on a task
exports.createComment = async (req, res) => {
  try {
    const { taskId, content, mentions } = req.body;

    // check if task exists
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comment = new Comment({
      taskId,
      author: req.user.id, // from auth middleware
      content,
      mentions,
    });

    await comment.save();

    // optional: push comment into task.comments array
    task.comments.push(comment._id);
    await task.save();

    // populate author + mentions
    await comment.populate("author", "name email");
    await comment.populate("mentions", "name email");

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// ✅ Get all comments for a task
exports.getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ taskId })
      .populate("author", "name email")
      .populate("mentions", "name email")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

// ✅ Update comment (only author can update)
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, mentions } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    comment.content = content || comment.content;
    comment.mentions = mentions || comment.mentions;
    await comment.save();

    await comment.populate("author", "name email");
    await comment.populate("mentions", "name email");

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};

// ✅ Delete comment (only author or task owner can delete)
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId).populate("taskId");
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const task = await Task.findById(comment.taskId);

    // allow delete if author OR task owner
    if (
      comment.author.toString() !== req.user.id &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    // also remove from task.comments
    task.comments = task.comments.filter(
      (cId) => cId.toString() !== commentId
    );
    await task.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};
