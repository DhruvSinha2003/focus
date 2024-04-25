import React, { useState } from "react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [showPanel, setShowPanel] = useState(false);

  const addTodo = () => {
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
      <button
        style={{ position: "fixed", top: "20px", right: "20px" }}
        onClick={() => setShowPanel(!showPanel)}
      >
        Todo
      </button>
      {showPanel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            width: "300px",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h2>Todo List</h2>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new todo"
          />
          <button onClick={addTodo}>Add</button>
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
      )}
    </div>
  );
};

export default TodoList;