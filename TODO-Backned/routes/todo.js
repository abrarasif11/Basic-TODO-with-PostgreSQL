const { Router } = require("express");
const pool = require("../db.js");

const router = Router();

// Create a new todo
router.post("/", async (req, res) => {
  try {
    const { description, completed } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }
    const newTodo = await pool.query(
      "INSERT INTO todo (description, completed) VALUES ($1, $2) RETURNING *",
      [description, completed || false]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
