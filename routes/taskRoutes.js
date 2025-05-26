const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");

router.get("/test", auth, (req, res) => {
  res.json({
    message: "Task routes are working!",
    user: req.user,
    token: req.token,
  });
});

// CRUD users
router.post("/to-do", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();
    res.status(201).json({ task, message: "Task Created Successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message || "Failed to create task" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.status(200).json({
      tasks,
      message: "Tasks fetched successfully",
      count: tasks.length,
    });
  } catch (error) {
    res.status(500).send({ error: error.message || "Failed to fetch tasks" });
  }
});

router.get("/:id", auth, async (req, res) => {
  const taskId = req.params.id;
  if (!taskId) {
    return res.status(400).send({ error: "Task ID is required" });
  }
  try {
    const task = await Task.findOne({
      _id: taskId,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(200).json({ task, message: "Task fetched successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message || "Failed to fetch task" });
  }
});

router.patch("/:id", auth, async (req, res) => {
  const taskId = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  if (!taskId) {
    return res.status(400).send({ error: "Task ID is required" });
  }
  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).send({ error: error.message || "Failed to update task" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const taskId = req.params.id;
  if (!taskId) {
    return res.status(400).send({ error: "Task ID is required" });
  }
  try {
    const task = await Task.findOneAndDelete({
      _id: taskId,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully", task });
  } catch (error) {
    res.status(500).send({ error: error.message || "Failed to delete task" });
  }
});

module.exports = router;
