import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion as _motion, AnimatePresence } from "framer-motion";
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

  const getTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch todos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

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
      setError("Failed to add todo.");
    }
  };

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
      setError("Failed to update todo.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete todo.");
    }
  };

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
      setError("Failed to update todo status.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 flex justify-center items-center p-4">
      <_motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-slate-700 relative overflow-hidden"
      >
        {/* Neon border animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-700 to-purple-600 opacity-30 blur-2xl rounded-2xl animate-pulse"></div>

        <h1 className="relative text-4xl font-extrabold text-cyan-400 mb-8 text-center drop-shadow-lg tracking-wider">
          ⚡ PERN TODO APP
        </h1>

        {/* Error Animation */}
        <AnimatePresence>
          {error && (
            <_motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 text-red-400 p-3 rounded mb-4 border border-red-400/40 text-center"
            >
              {error}
            </_motion.div>
          )}
        </AnimatePresence>

        {/* Add Todo Form */}
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="relative flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl shadow-inner border border-slate-700 hover:border-cyan-500/50 transition"
        >
          <input
            {...register("description", { required: true })}
            className="flex-1 bg-transparent text-slate-200 outline-none px-3 py-2 placeholder-slate-500"
            placeholder="💡 Add a new task..."
          />
          <_motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-cyan-500/30 transition"
            type="submit"
          >
            Add
          </_motion.button>
        </form>
        {errors.description && (
          <p className="text-red-400 text-sm mt-1 text-center">
            Please enter a task!
          </p>
        )}

        {/* Todo List */}
        <div className="mt-6 space-y-4 relative z-10">
          {loading ? (
            <_motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-400 text-center"
            >
              Loading your awesome tasks...
            </_motion.p>
          ) : todos.length === 0 ? (
            <_motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 text-center text-lg italic"
            >
              💤 No tasks yet — time to get productive!
            </_motion.p>
          ) : (
            <AnimatePresence>
              {todos.map((todo) => (
                <_motion.div
                  key={todo.todo_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center bg-slate-900/70 p-3 rounded-xl border border-slate-700 hover:border-cyan-500/50 hover:shadow-cyan-500/20 transition-all duration-300"
                >
                  {editingTodo === todo.todo_id ? (
                    <div className="flex w-full items-center gap-3">
                      <input
                        {...register("editedText", { required: true })}
                        className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
                        defaultValue={todo.description}
                      />
                      <div className="flex gap-2">
                        <_motion.button
                          whileTap={{ scale: 0.9 }}
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
                        </_motion.button>
                        <_motion.button
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => setEditingTodo(null)}
                          className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                        >
                          <IoClose size={20} />
                        </_motion.button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <_motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => toggleCompleted(todo.todo_id)}
                          className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center transition ${
                            todo.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-slate-600 hover:border-cyan-500"
                          }`}
                        >
                          {todo.completed && <MdOutlineDone size={14} />}
                        </_motion.button>
                        <span
                          className={`text-slate-200 transition-all ${
                            todo.completed
                              ? "line-through opacity-60 italic"
                              : "hover:text-cyan-400"
                          }`}
                        >
                          {todo.description}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <_motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => {
                            setEditingTodo(todo.todo_id);
                            setValue("editedText", todo.description);
                          }}
                          className="p-2 text-cyan-400 hover:text-cyan-300 rounded-lg transition"
                        >
                          <MdModeEditOutline />
                        </_motion.button>
                        <_motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => deleteTodo(todo.todo_id)}
                          className="p-2 text-red-500 hover:text-red-400 rounded-lg transition"
                        >
                          <FaTrash />
                        </_motion.button>
                      </div>
                    </>
                  )}
                </_motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </_motion.div>
    </div>
  );
}

export default App;
