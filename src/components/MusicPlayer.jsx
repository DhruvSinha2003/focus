import React, { useEffect, useState } from "react";
import ReactHowler from "react-howler";

// Import audio files
import * as brownNoiseFiles from "../music/brown_noise/brown_noise.mp3";
import * as cafeAmbientFiles from "../music/cafe_ambient/jazz_cafe.mp3";
import * as lofiFiles from "../music/lofi/lofi.mp3";

const audioFilesMappings = {
  lofi: Object.values(lofiFiles),
  cafe_ambient: Object.values(cafeAmbientFiles),
  brown_noise: Object.values(brownNoiseFiles),
};

const MusicPlayer = () => {
  const [selectedFolder, setSelectedFolder] = useState("lofi");
  const [audioFiles, setAudioFiles] = useState(audioFilesMappings.lofi);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setAudioFiles(audioFilesMappings[selectedFolder]);
  }, [selectedFolder]);

  const handleFolderChange = (e) => {
    setSelectedFolder(e.target.value);
    setCurrentAudioIndex(0);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentAudioIndex((prevIndex) =>
      prevIndex === 0 ? audioFiles.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentAudioIndex((prevIndex) =>
      prevIndex === audioFiles.length - 1 ? 0 : prevIndex + 1
    );
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
        Math.min(event.clientX - offset.x, window.innerWidth - 300)
      );
      const newY = Math.max(
        0,
        Math.min(event.clientY - offset.y, window.innerHeight - 150)
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
      className="music-player-container"
      style={{ top: position.y, left: position.x }}
      onMouseDown={handleMouseDown}
    >
      <h2 className="music-player-heading">Music Player</h2>
      <select
        className="music-player-select"
        value={selectedFolder}
        onChange={handleFolderChange}
      >
        <option value="lofi">Lofi</option>
        <option value="cafe_ambient">Cafe Ambient</option>
        <option value="brown_noise">Brown Noise</option>
      </select>
      <div className="music-player-buttons">
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={handleNext}>Next</button>
      </div>
      {audioFiles.length > 0 && (
        <ReactHowler
          src={audioFiles[currentAudioIndex]}
          playing={isPlaying}
          html5={true}
          preload={true}
        />
      )}
    </div>
  );
};

export default MusicPlayer;
