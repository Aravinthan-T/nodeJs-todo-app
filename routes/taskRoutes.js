const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Task routes are working!");
});

// CRUD users

module.exports = router;
