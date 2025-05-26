require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const express = require("express");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

require("./db");

const PORT = process.env.PORT || 3000;

// Enable CORS before routes
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Use express's built-in JSON parser
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

console.log("✅ Loaded PORT:", PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port - ${PORT}`);
});
