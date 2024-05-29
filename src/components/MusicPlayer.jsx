import React, { useEffect, useState } from "react";
import AudioPlayer from "react-audio-player";

const MusicPlayer = () => {
  const [selectedAudio, setSelectedAudio] = useState("lofi");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const componentWidth = 300; // Adjust the width of your music player
  const componentHeight = 150; // Adjust the height of your music player

  const handleInputChange = (e) => {
    setSelectedAudio(e.target.value);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

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

  useEffect(() => {
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

  return (
    <div
      className="music-player"
      style={{ top: position.y, left: position.x }}
      onMouseDown={handleMouseDown}
    >
      <h2>Music Player</h2>
      <select value={selectedAudio} onChange={handleInputChange}>
        <option value="lofi">Lofi</option>
        <option value="cafe_ambient">Cafe Ambient</option>
        <option value="brown_noise">Brown Noise</option>
      </select>
      <div className="audio-controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <AudioPlayer
        src={`public/${selectedAudio}.mp3`} // Adjust file extension if needed
        playing={isPlaying}
        controls={false} // Hide default controls since we have custom buttons
      />
    </div>
  );
};

export default MusicPlayer;
