const Task = require("../models/task.model");

exports.createTask = async (req, res) => {
  try {
    const { boardId, title, description, status, priority, dueDate } = req.body;

    if (!boardId || !title) {
      return res.status(400).json({ error: "boardId and title are required" });
    }

    const newTask = new Task({
      boardId,
      title,
      description,
      status,
      priority,
      dueDate,
      createdBy: req.user.id,   // <-- 👈 taken from auth middleware
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ 2. Get All Tasks for Logged-in User
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    }).populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("boardId", "title");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// ✅ 3. Get Single Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("boardId", "title");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
};

// ✅ 4. Update Task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only task creator can update (optional: also allow assigned users)
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// ✅ 5. Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

// ✅ 6. Assign Users to Task
exports.assignUsers = async (req, res) => {
  try {
    const { userIds } = req.body; // array of userIds
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.assignedTo = [...new Set([...task.assignedTo, ...userIds])]; // avoid duplicates
    await task.save();

    res.status(200).json({ message: "Users assigned successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error assigning users", error: error.message });
  }
};
exports.getTasksByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const tasks = await Task.find({ boardId });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks by board", error: error.message });
  }
};