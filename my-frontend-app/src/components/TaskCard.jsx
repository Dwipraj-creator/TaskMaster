import React, { useState, useEffect } from "react";
import { updateTask } from "../api/tasks";

export default function TaskModal({ task, closeModal, refreshTasks }) {
  const [editedTask, setEditedTask] = useState(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleSave = async () => {
    await updateTask(editedTask._id, editedTask);
    refreshTasks();
    closeModal();
  };

  if (!editedTask) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

        <input
          type="text"
          className="w-full p-2 mb-2 border rounded"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          placeholder="Title"
        />
        <textarea
          className="w-full p-2 mb-2 border rounded"
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          placeholder="Description"
        />
        <select
          className="w-full p-2 mb-2 border rounded"
          value={editedTask.priority || "medium"}
          onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          className="w-full p-2 mb-2 border rounded"
          value={editedTask.dueDate ? editedTask.dueDate.split("T")[0] : ""}
          onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
