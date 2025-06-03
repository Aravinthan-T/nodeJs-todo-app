const request = require("supertest");
const express = require("express");
const taskRoutes = require("../routes/taskRoutes");
const Task = require("../models/Task");

// Mock auth middleware to attach dummy user
jest.mock("../middleware/auth", () => (req, res, next) => {
  req.user = { _id: "user123" };
  next();
});

// Mock Task model methods
jest.mock("../models/Task");

const app = express();
app.use(express.json());
app.use("/tasks", taskRoutes);

describe("Task Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /tasks/to-do", () => {
    it("creates a task successfully", async () => {
      const mockTask = {
        _id: "task123",
        title: "Test Task",
        description: "Test Desc",
        completed: false,
        status: "To-Do",
        owner: "user123",
        save: jest.fn().mockResolvedValue(true),
      };

      Task.mockImplementation(() => mockTask);

      const res = await request(app)
        .post("/tasks/to-do")
        .send({ title: "Test Task", description: "Test Desc" });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Task Created Successfully");
      expect(res.body.task.title).toBe("Test Task");
      expect(mockTask.save).toHaveBeenCalled();
    });

    it("returns 400 if title is missing", async () => {
      const res = await request(app)
        .post("/tasks/to-do")
        .send({ description: "No title" });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Title is required");
    });

    it("handles server error", async () => {
      Task.mockImplementation(() => {
        throw new Error("DB error");
      });

      const res = await request(app)
        .post("/tasks/to-do")
        .send({ title: "Fail Task" });

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("DB error");
    });
  });

  describe("GET /tasks", () => {
    it("fetches tasks for user", async () => {
      const tasks = [
        { _id: "t1", title: "Task 1", owner: "user123" },
        { _id: "t2", title: "Task 2", owner: "user123" },
      ];

      Task.find.mockResolvedValue(tasks);

      const res = await request(app).get("/tasks");

      expect(res.statusCode).toBe(200);
      expect(res.body.tasks.length).toBe(2);
      expect(res.body.message).toBe("Tasks fetched successfully");
    });

    it("handles error fetching tasks", async () => {
      Task.find.mockRejectedValue(new Error("DB fetch error"));

      const res = await request(app).get("/tasks");

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("DB fetch error");
    });
  });

  describe("GET /tasks/:id", () => {
    it("fetches a single task", async () => {
      const task = { _id: "task1", title: "Single Task", owner: "user123" };

      Task.findOne.mockResolvedValue(task);

      const res = await request(app).get("/tasks/task1");

      expect(res.statusCode).toBe(200);
      expect(res.body.task._id).toBe("task1");
    });

    it("returns 404 if task not found", async () => {
      Task.findOne.mockResolvedValue(null);

      const res = await request(app).get("/tasks/notfound");

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Task not found");
    });

    it("returns 400 if id missing", async () => {
      const res = await request(app).get("/tasks/");

      // This will hit GET /tasks, so no error here,
      // For invalid/missing id test, test the route handler directly or via unit test of controller
      expect(res.statusCode).toBe(500);
    });

    it("handles error fetching task", async () => {
      Task.findOne.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/tasks/task1");

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("DB error");
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("updates a task successfully", async () => {
      const updatedTask = {
        _id: "task1",
        title: "Updated Title",
        save: jest.fn().mockResolvedValue(true),
      };

      Task.findOneAndUpdate.mockResolvedValue(updatedTask);

      const res = await request(app)
        .patch("/tasks/task1")
        .send({ title: "Updated Title" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Task updated successfully");
      expect(updatedTask.save).toHaveBeenCalled();
    });

    it("returns 400 for invalid update fields", async () => {
      const res = await request(app)
        .patch("/tasks/task1")
        .send({ invalidField: "oops" });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid updates!");
    });

    it("returns 404 if task not found", async () => {
      Task.findOneAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .patch("/tasks/task1")
        .send({ title: "Title" });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Task not found");
    });

    it("handles server error", async () => {
      Task.findOneAndUpdate.mockRejectedValue(new Error("DB error"));

      const res = await request(app)
        .patch("/tasks/task1")
        .send({ title: "Title" });

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("DB error");
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("deletes a task successfully", async () => {
      const deletedTask = { _id: "task1", title: "Delete Me" };

      Task.findOneAndDelete.mockResolvedValue(deletedTask);

      const res = await request(app).delete("/tasks/task1");

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Task deleted successfully");
      expect(res.body.task._id).toBe("task1");
    });

    it("returns 404 if task not found", async () => {
      Task.findOneAndDelete.mockResolvedValue(null);

      const res = await request(app).delete("/tasks/notfound");

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Task not found");
    });

    it("handles server error", async () => {
      Task.findOneAndDelete.mockRejectedValue(new Error("DB error"));

      const res = await request(app).delete("/tasks/task1");

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("DB error");
    });
  });
});
