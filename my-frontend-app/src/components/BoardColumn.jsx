import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { createTask } from "../api/tasks";

export default function BoardColumn({ columnId, title, tasks, boardId, refreshTasks, openTaskModal }) {
  const [showInput, setShowInput] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

const handleAddTask = async () => {
  if (!newTaskTitle) return;
  await createTask(
    boardId, 
    { title: newTaskTitle, status: columnId, description: "" }
  );
  setNewTaskTitle("");
  setShowInput(false);
  refreshTasks();
};

  return (
    <div className="bg-gray-100 p-4 rounded w-72 flex flex-col">
      <h3 className="font-bold text-lg mb-4">{title}</h3>

      <Droppable droppableId={columnId}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 min-h-[100px]">
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-2 mb-2 rounded shadow ${
                      snapshot.isDragging ? "bg-blue-100" : "bg-white"
                    } cursor-pointer`}
                    onClick={() => openTaskModal(task)}
                  >
                    <h4 className="font-bold">{task.title}</h4>
                    <p className="text-sm">{task.description}</p>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {showInput ? (
        <div className="mt-2 flex flex-col">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title"
            className="p-2 mb-2 border rounded"
          />
          <div className="flex gap-2">
            <button onClick={handleAddTask} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Add</button>
            <button onClick={() => setShowInput(false)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowInput(true)} className="mt-2 text-blue-500 hover:underline">+ Add Task</button>
      )}
    </div>
  );
}
