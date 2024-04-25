import React, { useState, useRef } from "react";
import { FaListAlt } from "react-icons/fa";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);

  const togglePanel = () => {
    setPanelOpen(!panelOpen);
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { text: newTodo.trim(), completed: false }]);
      setNewTodo("");
    }
  };

  const toggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const editTodo = (index, newText) => {
    const updatedTodos = [...todos];
    updatedTodos[index].text = newText.trim();
    setTodos(updatedTodos);
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: panelOpen ? "320px" : "20px",
          transition: "right 0.3s ease-in-out",
        }}
      >
        <button onClick={togglePanel}>
          <FaListAlt />
        </button>
      </div>
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          top: 0,
          right: panelOpen ? 0 : "-320px",
          height: "100vh",
          width: "300px",
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.2)",
          transition: "right 0.3s ease-in-out",
        }}
      >
        <h2>Todo List</h2>
        <form onSubmit={addTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Todo item"
          />
          <button type="submit">Add</button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(index)}
              />
              {todo.completed ? (
                <span style={{ textDecoration: "line-through" }}>
                  {todo.text}
                </span>
              ) : (
                <span>{todo.text}</span>
              )}
              <button onClick={() => removeTodo(index)}>Remove</button>
              <input
                type="text"
                defaultValue={todo.text}
                onBlur={(e) => editTodo(index, e.target.value)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;