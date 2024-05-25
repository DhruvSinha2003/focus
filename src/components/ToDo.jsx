import React, { useEffect, useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import "./components.css";

export default function ToDo() {
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState(["Write a todo item and press enter"]);
  const [position, setPosition] = useState({
    x: window.innerWidth - 320, // Adjusted to align with right edge
    y: 10, // Top alignment
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const componentWidth = 300;
  const componentHeight = 400;

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
  }, [isDragging, offset]);

  const handleMouseDown = (event) => {
    const boundingBox = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - boundingBox.left;
    const offsetY = event.clientY - boundingBox.top;
    setOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  return (
    <div
      className="todo-container"
      style={{ top: position.y, left: position.x }}
      onMouseDown={handleMouseDown}
    >
      <Sidebar>
        <Menu>
          <SubMenu label="To Do List">
            {items.map((item, index) => (
              <MenuItem key={index}>
                <div className="menu-item-content">
                  {item}
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="delete-button"
                  >
                    ✓
                  </button>
                </div>
              </MenuItem>
            ))}
            <MenuItem>
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
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
}
