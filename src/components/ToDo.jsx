import React, { useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import "./components.css";

export default function ToDo() {
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState(["Pie charts", "Line charts"]);

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

  return (
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
        </SubMenu>
        <div className="input-container">
          <input
            type="text"
            value={newItem}
            onChange={handleInputChange}
            placeholder="Add a new to-do item"
            className="todo-input"
          />
          <button onClick={handleAddItem} className="add-button">
            Add ToDo item
          </button>
        </div>
      </Menu>
    </Sidebar>
  );
}
