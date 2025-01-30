import React, { useEffect, useState } from "react";

const Todo = () => {
  const [todos, setTodos] = useState(["Write a todo item and press enter"]);
  const [newTodo, setNewTodo] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 344,
    y: 24,
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = Math.max(
          0,
          Math.min(e.clientX - offset.x, window.innerWidth - 320)
        );
        const newY = Math.max(
          0,
          Math.min(e.clientY - offset.y, window.innerHeight - 100)
        );
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo.trim()]);
      setNewTodo("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleDeleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div
      className="todo-container glass-panel"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: "absolute",
        top: 0,
        left: 0,
        width: "320px",
      }}
    >
      <div
        className="todo-header"
        onMouseDown={handleMouseDown}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          cursor: "move",
        }}
      >
        <h1 style={{ fontSize: "18px" }}>To Do List</h1>
        <button
          className="icon-button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: "24px",
            height: "24px",
            padding: 0,
            minWidth: "24px",
          }}
        >
          <i className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}></i>
        </button>
      </div>

      {isExpanded && (
        <div
          style={{ padding: "8px 16px", maxHeight: "240px", overflowY: "auto" }}
        >
          <div className="todo-input-container" style={{ marginBottom: "8px" }}>
            <input
              type="text"
              className="todo-input"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add new task..."
              style={{
                height: "32px",
                fontSize: "14px",
              }}
            />
            <button
              className="todo-button"
              onClick={handleAddTodo}
              style={{
                width: "32px",
                height: "32px",
                padding: 0,
                minWidth: "32px",
              }}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>

          <ul className="todo-list" style={{ margin: 0, padding: 0 }}>
            {todos.map((todo, index) => (
              <li
                key={index}
                className="todo-item"
                style={{
                  padding: "8px 12px",
                  marginBottom: "4px",
                  fontSize: "14px",
                  minHeight: "36px",
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {todo}
                </span>
                <button
                  className="icon-button"
                  onClick={() => handleDeleteTodo(index)}
                  style={{
                    width: "24px",
                    height: "24px",
                    padding: 0,
                    minWidth: "24px",
                  }}
                >
                  <i className="fas fa-check"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Todo;
