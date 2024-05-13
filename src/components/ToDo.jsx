import React, { useEffect, useState } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";

export default function ToDo() {
  return (
    <div>
      <Sidebar>
        <Menu>
          <MenuItem>TO DO List</MenuItem>
          <MenuItem>TO DO List</MenuItem>
          <MenuItem>TO DO List</MenuItem>
          <MenuItem>TO DO List</MenuItem>
          <MenuItem>TO DO List</MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}
