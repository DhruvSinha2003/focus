import React, { useState, useEffect } from "react";
import { FiMaximize } from "react-icons/fi";
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
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 220 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const componentWidth = 300; // Add this line
  const componentHeight = 200; // Add this line

  const handleMouseDown = (event) => {
    const boundingBox = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - boundingBox.left;
    const offsetY = event.clientY - boundingBox.top;
    setOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(event.clientX - offset.x, window.innerWidth - componentWidth));
      const newY = Math.max(0, Math.min(event.clientY - offset.y, window.innerHeight - componentHeight));
      setPosition({
        x: newX,
        y: newY,
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
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (
      !doc.fullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
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
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: -1,
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
            <button className="minimize-button" onClick={() => setMenuExpanded(!menuExpanded)}>
              Minimize
            </button>
          </div>
        ) : (
          <button
            className="change-background-button"
            onClick={() => setMenuExpanded(true)}
          >
            Change Background
          </button>
        )}
        <button className="fullscreen-button" onClick={toggleFullscreen}>
          <FiMaximize />
        </button>
      </div>
    </div>
  );
};

export default Background;