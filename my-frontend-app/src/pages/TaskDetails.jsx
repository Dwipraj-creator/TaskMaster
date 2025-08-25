import React from "react";
import Comments from "../components/Comments";

const TaskDetails = ({ task, token }) => {
  if (!task) return null;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>

      {/* Comments Section */}
      <Comments taskId={task._id} token={token} />
    </div>
  );
};

export default TaskDetails;
