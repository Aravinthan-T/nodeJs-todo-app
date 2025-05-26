import React, { useEffect, useState } from "react";
import TaskForm from "./components/forms/TaskForm";
import TaskList from "./components/forms/TaskList";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  setAuthToken,
} from "./services/api";
import RegisterForm from "./components/forms/RegisterForm";
import { Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import AppNavbar from "./components/navBar/AppNavBar";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setIsAuthenticated(false);
    setTasks([]);
    setEditingTask(null);
    showToast("Logged out successfully", "success");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      loadTasks();
    }
  }, []);

  const loadTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data.tasks || []);
    } catch (error) {
      showToast("Failed to fetch tasks", "danger");
    }
  };

  // Toast helper
  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "" }), 3000);
  };

  if (!isAuthenticated) {
    return (
      <RegisterForm
        onRegister={() => {
          setIsAuthenticated(true);
          loadTasks();
        }}
      />
    );
  }

  const handleAddTask = async (taskData) => {
    try {
      await createTask(taskData);
      showToast("Task added successfully", "success");
      loadTasks();
    } catch (error) {
      showToast("Failed to add task", "danger");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      showToast("Task deleted successfully", "success");
      loadTasks();
    } catch (error) {
      showToast("Failed to delete task", "danger");
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask._id, taskData);
      setEditingTask(null);
      showToast("Task updated successfully", "success");
      loadTasks();
    } catch (error) {
      showToast("Failed to update task", "danger");
    }
  };

  return (
    <>
      <AppNavbar onLogout={handleLogout} />
      <Container>
        <h2 className="mb-4 text-center my-3">Task Manager</h2>

        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8} lg={6}>
            <TaskForm
              key={editingTask?._id || "new"}
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              initialData={editingTask}
              buttonLabel={editingTask ? "Update Task" : "Add Task"}
            />
          </Col>
        </Row>

        <Row>
          <TaskList
            tasks={tasks}
            onEdit={(task) => setEditingTask(task)}
            onDelete={handleDeleteTask}
          />
        </Row>
      </Container>

      {/* Toast container */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          bg={toast.variant}
          delay={3000}
          autohide
        >
          <Toast.Body
            className={toast.variant === "danger" ? "text-white" : ""}
          >
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default App;
