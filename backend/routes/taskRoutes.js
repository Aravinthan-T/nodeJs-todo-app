const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */

/**
 * @swagger
 * /tasks/to-do:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Title is required
 */
router.post("/to-do", auth, async (req, res) => {
  try {
    const { title, description, completed, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = new Task({
      title,
      description,
      completed,
      status,
      owner: req.user._id,
    });

    await task.save();
    res.status(201).json({ task, message: "Task Created Successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message || "Failed to create task" });
  }
});

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks of the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
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

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *       404:
 *         description: Task not found
 */
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

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a specific task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid updates or missing ID
 *       404:
 *         description: Task not found
 */
router.patch("/:id", auth, async (req, res) => {
  const taskId = req.params.id;
  const allowedUpdates = ["title", "description", "status"];
  const updates = Object.keys(req.body);
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

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
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
