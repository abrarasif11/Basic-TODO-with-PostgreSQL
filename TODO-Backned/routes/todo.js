const { Router } = require("express");
const pool = require("../db");

const router = Router();

// Create a new todo
router.post("/", async (req, res) => {
  try {
    const { description, completed = false } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const newTodo = await pool.query(
      "INSERT INTO todo (description, completed) VALUES ($1, $2) RETURNING *",
      [description, completed]
    );

    res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get all todos
router.get("/", async (req, res) => {
  try {
    const allTodos = await pool.query(
      "SELECT * FROM todo ORDER BY todo_id ASC"
    );
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Update a todo
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed = false } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const updatedTodo = await pool.query(
      "UPDATE todo SET description = $1, completed = $2 WHERE todo_id = $3 RETURNING *",
      [description, completed, id]
    );

    if (updatedTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(updatedTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
      [id]
    );

    if (deletedTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({
      message: "Todo was deleted!",
      todo: deletedTodo.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
