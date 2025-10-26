import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const API_URL = "http://localhost:5000/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch Todos
  const getTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to fetch todos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  // Add Todo
  const onSubmitForm = async (data) => {
    try {
      setError(null);
      const res = await axios.post(API_URL, {
        description: data.description.trim(),
        completed: false,
      });
      setTodos([...todos, res.data]);
      reset();
    } catch (err) {
      console.error(err);
      setError("❌ Failed to add todo.");
    }
  };

  // Save Edit
  const saveEdit = async (id, newText) => {
    try {
      await axios.put(`${API_URL}/${id}`, { description: newText });
      setTodos(
        todos.map((todo) =>
          todo.todo_id === id ? { ...todo, description: newText } : todo
        )
      );
      setEditingTodo(null);
      setValue("editedText", "");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update todo.");
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (err) {
      console.error(err);
      setError("❌ Failed to delete todo.");
    }
  };

  // Toggle Completion
  const toggleCompleted = async (id) => {
    try {
      const todo = todos.find((t) => t.todo_id === id);
      await axios.put(`${API_URL}/${id}`, {
        description: todo.description,
        completed: !todo.completed,
      });
      setTodos(
        todos.map((t) =>
          t.todo_id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update todo status.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-cyan-900 flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-slate-700"
      >
        <h1 className="text-4xl font-extrabold text-cyan-400 mb-8 text-center drop-shadow-lg tracking-wide">
          🚀 PERN TODO APP
        </h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 text-red-400 p-3 rounded mb-4 border border-red-400/40"
          >
            {error}
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl shadow-inner border border-slate-700"
        >
          <input
            {...register("description", { required: true })}
            className="flex-1 bg-transparent text-slate-200 outline-none px-3 py-2 placeholder-slate-500"
            placeholder="💡 Add a new task..."
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:opacity-90"
            type="submit"
          >
            Add
          </motion.button>
        </form>
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">Please enter a task!</p>
        )}

        {/* Todos */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="text-slate-400">Loading your cool tasks...</p>
          ) : todos.length === 0 ? (
            <p className="text-slate-500 text-center">
              💤 No tasks yet — add something awesome!
            </p>
          ) : (
            <AnimatePresence>
              {todos.map((todo) => (
                <motion.div
                  key={todo.todo_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-between items-center bg-slate-900/70 p-3 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition duration-300"
                >
                  {editingTodo === todo.todo_id ? (
                    <div className="flex w-full items-center gap-3">
                      <input
                        {...register("editedText", { required: true })}
                        className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
                        defaultValue={todo.description}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            saveEdit(
                              todo.todo_id,
                              document.querySelector('[name="editedText"]')
                                .value
                            )
                          }
                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                        >
                          <MdOutlineDone size={20} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTodo(null)}
                          className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                        >
                          <IoClose size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleCompleted(todo.todo_id)}
                          className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center transition ${
                            todo.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-slate-600 hover:border-cyan-500"
                          }`}
                        >
                          {todo.completed && <MdOutlineDone size={14} />}
                        </button>
                        <span
                          className={`text-slate-200 ${
                            todo.completed ? "line-through opacity-60" : ""
                          }`}
                        >
                          {todo.description}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTodo(todo.todo_id);
                            setValue("editedText", todo.description);
                          }}
                          className="p-2 text-cyan-400 hover:text-cyan-300 rounded-lg transition"
                        >
                          <MdModeEditOutline />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.todo_id)}
                          className="p-2 text-red-500 hover:text-red-400 rounded-lg transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default App;
