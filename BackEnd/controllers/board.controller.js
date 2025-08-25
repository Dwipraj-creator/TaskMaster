const Board = require("../models/board.model");
const Task = require("../models/task.model");

// 1. Create a new board
exports.createBoard = async (req, res) => {
  try {
    const { title, description, columns } = req.body;

    const newBoard = new Board({
      title: title || "My Board",
      description: description || "",
      owner: req.user.id, // owner of the board
      collaborators: [req.user.id], // creator is automatically a collaborator
      columns: columns && columns.length > 0
        ? columns
        : [
            { name: "To Do", order: 1 },
            { name: "In Progress", order: 2 },
            { name: "Completed", order: 3 },
          ],
    });

    await newBoard.save();
    res.status(201).json({ message: "Board created successfully", board: newBoard });
  } catch (error) {
    res.status(500).json({ message: "Error creating board", error: error.message });
  }
};

// 2. Get all boards for logged-in user
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
    }).populate("collaborators", "name email");

    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching boards", error: error.message });
  }
};

// 3. Get a single board by ID (with its tasks)
exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate("collaborators", "name email");
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Fetch tasks belonging to this board
    const tasks = await Task.find({ boardId: board._id });

    res.status(200).json({ board, tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching board", error: error.message });
  }
};

// 4. Update board (title/description/columns)
exports.updateBoard = async (req, res) => {
  try {
    const { title, description, columns } = req.body;

    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Only the owner can update
    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this board" });
    }

    board.title = title || board.title;
    board.description = description || board.description;
    board.columns = columns || board.columns;

    await board.save();
    res.status(200).json({ message: "Board updated successfully", board });
  } catch (error) {
    res.status(500).json({ message: "Error updating board", error: error.message });
  }
};

// 5. Delete board
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this board" });
    }

    await board.deleteOne();

    // Optional: also delete tasks related to this board
    await Task.deleteMany({ boardId: req.params.id });

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting board", error: error.message });
  }
};

// 6. Add member to board
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Only owner can add members
    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to add members" });
    }

    if (!board.collaborators.includes(userId)) {
      board.collaborators.push(userId);
    }

    await board.save();
    res.status(200).json({ message: "Member added successfully", board });
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error: error.message });
  }
};
