const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const todoRoutes = require("./routes/todo");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/todos", todoRoutes);
app.get("/", (req, res) => {
  res.send("Todo Server");
});

app.listen(port, () => {
  console.log(`Server is running on : ${port}`);
});
