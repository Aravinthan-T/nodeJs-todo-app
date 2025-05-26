import React, { useState } from "react";

const TaskForm = ({ onSubmit, initialData = {}, buttonLabel = "Add Task" }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [status, setStatus] = useState(initialData?.status || "To Do");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status,
    });

    if (!initialData?._id) {
      setTitle("");
      setDescription("");
      setStatus("To Do");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        className="form-control mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select
        className="form-control mb-2"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>To Do</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>
      <button type="submit" className="btn btn-primary">
        {buttonLabel}
      </button>
    </form>
  );
};

export default TaskForm;
