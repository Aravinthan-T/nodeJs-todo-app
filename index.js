const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

require("dotenv").config();
require("./db");
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Task Manager API is running!");
});

console.log("✅ Loaded PORT:", JSON.stringify(process.env.PORT));

app.listen(PORT, () => {
  console.log(`Server is running on port - ${PORT}`);
});
