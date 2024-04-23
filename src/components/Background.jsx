import React, { useState, useEffect } from "react";
import a from "../assets/images/a.png";
import b from "../assets/images/b.jpg";
import c from "../assets/images/c.jpg";
import d from "../assets/images/d.jpg";
import e from "../assets/images/e.png";
import "./components.css";

const Background = () => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const defaultImages = [a, b, c, d, e];
  const [menuExpanded, setMenuExpanded] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (event) => {
    const boundingBox = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - boundingBox.left;
    const offsetY = event.clientY - boundingBox.top;
    setOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      setPosition({
        x: event.clientX - offset.x,
        y: event.clientY - offset.y,
      });
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

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, [isDragging, offset]);

  const defaultImageThumbnails = defaultImages.map((image, index) => (
    <img
      key={index}
      src={image}
      alt={`Default Image ${index}`}
      onClick={() => setBackgroundImage(image)}
      style={{
        cursor: "pointer",
        width: "100px",
        height: "100px",
        objectFit: "cover",
        margin: "5px",
      }}
    />
  ));

  return (
    <div className="background-container">
      {backgroundImage && (
        <div
          className="background-image"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100vw",
            height: "100vh",
          }}
        />
      )}
      <div
        className="background-menu"
        style={{ top: position.y, left: position.x }}
        onMouseDown={handleMouseDown}
      >
        {menuExpanded ? (
          <div>
            <h1 className="timer-heading">Select Background</h1>
            <div>{defaultImageThumbnails}</div>
          </div>
        ) : (
          <button
            className="change-background-button"
            onClick={() => setMenuExpanded(true)}
          >
            Change Background
          </button>
        )}
        <button
          className="minimize-button"
          onClick={() => setMenuExpanded(!menuExpanded)}
        >
          {menuExpanded ? "Minimize" : "Expand"}
        </button>
      </div>
    </div>
  );
};

export default Background;