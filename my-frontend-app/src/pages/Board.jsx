import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext} from '@hello-pangea/dnd';
import { getBoardById } from "../api/boards";
import { getTasksByBoard, updateTask } from "../api/tasks";
import BoardColumn from "../components/BoardColumn";
import TaskModal from "../components/TaskCard";

export default function Board() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState({ todo: [], "in-progress": [], completed: [] });
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchBoard();
    fetchTasks();
  }, [id]);

  const fetchBoard = async () => {
    const res = await getBoardById(id);
    setBoard(res.data);
  };

  const fetchTasks = async () => {
    const res = await getTasksByBoard(id);
    const grouped = { todo: [], "in-progress": [], completed: [] };
    res.data.forEach((task) => grouped[task.status].push(task));
    setTasks(grouped);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const task = tasks[source.droppableId].find((t) => t._id === draggableId);

    const newSourceTasks = Array.from(tasks[source.droppableId]);
    newSourceTasks.splice(source.index, 1);

    const newDestTasks = Array.from(tasks[destination.droppableId]);
    newDestTasks.splice(destination.index, 0, { ...task, status: destination.droppableId });

    setTasks({
      ...tasks,
      [source.droppableId]: newSourceTasks,
      [destination.droppableId]: newDestTasks,
    });

    await updateTask(task._id, { status: destination.droppableId });
  };

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  if (!board) return <p>Loading...</p>;

  const columns = ["todo", "in-progress", "completed"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{board.name}</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {columns.map((col) => (
            <BoardColumn
              key={col}
              columnId={col}
              title={col.toUpperCase()}
              tasks={tasks[col]}
              boardId={board._id}
              refreshTasks={fetchTasks}
              openTaskModal={openTaskModal}
            />
          ))}
        </div>
      </DragDropContext>

      {modalOpen && selectedTask && (
        <TaskModal
          task={selectedTask}
          closeModal={() => setModalOpen(false)}
          refreshTasks={fetchTasks}
        />
      )}
    </div>
  );
}
