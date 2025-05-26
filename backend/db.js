const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || "task-manager";
mongoose
  .connect(MONGO_URL, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
module.exports = mongoose;
