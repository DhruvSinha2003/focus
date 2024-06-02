import React, { useEffect, useState } from "react";
import "./components.css";

export default function ToDo() {
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState(["Write a todo item and press enter"]);
  const [position, setPosition] = useState({
    x: window.innerWidth - 320,
    y: 20,
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const componentWidth = 300;
  const componentHeight = 400; // Define componentHeight here

  const handleInputChange = (e) => {
    setNewItem(e.target.value);
  };

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      setItems([...items, newItem]);
      setNewItem("");
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((item, i) => i !== index);
    setItems(updatedItems);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDragging) {
        const newX = Math.max(
          0,
          Math.min(event.clientX - offset.x, window.innerWidth - componentWidth)
        );
        const newY = Math.max(
          0,
          Math.min(
            event.clientY - offset.y,
            window.innerHeight - componentHeight
          )
        );
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleSelectStart = (event) => {
      if (isDragging) {
        event.preventDefault();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, [isDragging, offset, componentWidth, componentHeight]);

  const handleMouseDown = (event) => {
    const boundingBox = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - boundingBox.left;
    const offsetY = event.clientY - boundingBox.top;
    setOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  const toggleSubMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="todo-container"
      style={{ top: position.y, left: position.x }}
      onMouseDown={handleMouseDown}
    >
      <div className="todo-header" onClick={toggleSubMenu}>
        <h3>To Do List</h3>
        <span className={`arrow ${isOpen ? "up" : "down"}`}>&#9660;</span>
      </div>
      <div className={`todo-content ${isOpen ? "expanded" : ""}`}>
        <ul className="todo-list">
          {items.map((item, index) => (
            <li key={index} className="todo-item">
              <span>{item}</span>
              <button
                onClick={() => handleDeleteItem(index)}
                className="delete-button"
              >
                ✓
              </button>
            </li>
          ))}
        </ul>
        <div className="input-container">
          <input
            type="text"
            value={newItem}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Add a new to-do item"
            className="todo-input"
          />
          <button onClick={handleAddItem} className="add-button">
            +
          </button>
        </div>
      </div>
    </div>
  );
}
