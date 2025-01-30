import React, { useEffect, useState } from "react";
import { FiMaximize, FiMinimize2 } from "react-icons/fi";
import a from "../assets/images/a.jpg";
import b from "../assets/images/b.png";
import c from "../assets/images/c.jpg";
import d from "../assets/images/d.jpg";
import e from "../assets/images/e.jpg";
import "./components.css";

const Background = () => {
  const [backgroundType, setBackgroundType] = useState("image");
  const [color, setColor] = useState("#1a1a1a");
  const [backgroundImage, setBackgroundImage] = useState(a);
  const [menuExpanded, setMenuExpanded] = useState(true);
  const defaultImages = [a, b, c, d, e];

  const [position, setPosition] = useState({
    x: 20,
    y: window.innerHeight - 100,
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const componentWidth = 300;
  const componentHeight = 200;

  const handleMouseDown = (event) => {
    const boundingBox = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - boundingBox.left;
    const offsetY = event.clientY - boundingBox.top;
    setOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const newX = Math.max(
        0,
        Math.min(event.clientX - offset.x, window.innerWidth - componentWidth)
      );
      const newY = Math.max(
        0,
        Math.min(event.clientY - offset.y, window.innerHeight - componentHeight)
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

  const toggleFullscreen = () => {
    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;

    const cancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      docEl.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (!doc.fullscreenElement) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
  };

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
    <div
      className={`draggable-component ${!menuExpanded ? "minimized" : ""}`}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: componentWidth,
        height: componentHeight,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      {backgroundType === "image" ? (
        <div className="background-container">
          <img
            src={backgroundImage}
            alt="Background"
            className="background-image"
          />
        </div>
      ) : (
        <div
          className="background-container"
          style={{ backgroundColor: color }}
        />
      )}

      <div
        className={`glass-panel background-menu ${
          !menuExpanded ? "minimized" : ""
        }`}
      >
        {menuExpanded ? (
          <>
            <div className="background-header">
              <h2>Background Settings</h2>
              <button
                className="icon-button"
                onClick={() => setMenuExpanded(false)}
              >
                <FiMinimize2 />
              </button>
            </div>

            <div className="background-type-selector">
              <button
                className={`type-button ${
                  backgroundType === "image" ? "active" : ""
                }`}
                onClick={() => setBackgroundType("image")}
              >
                Images
              </button>
              <button
                className={`type-button ${
                  backgroundType === "color" ? "active" : ""
                }`}
                onClick={() => setBackgroundType("color")}
              >
                Solid Color
              </button>
            </div>

            {backgroundType === "image" ? (
              <div className="background-controls">
                {defaultImages.map((image, index) => (
                  <div
                    key={index}
                    className={`background-thumbnail ${
                      backgroundImage === image ? "active" : ""
                    }`}
                    onClick={() => setBackgroundImage(image)}
                  >
                    <img src={image} alt={`Background ${index + 1}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="color-picker-container">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="color-picker"
                />
              </div>
            )}
          </>
        ) : (
          <button className="icon-button" onClick={() => setMenuExpanded(true)}>
            <FiMaximize />
          </button>
        )}
      </div>
    </div>
  );
};

export default Background;
