import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useRef, useState } from "react";
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
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef(null);

  useEffect(() => {
    setAudioFiles(audioFilesMappings[selectedFolder]);
    setCurrentAudioIndex(0);
    setIsPlaying(false);
  }, [selectedFolder]);

  const handleFolderChange = (e) => {
    setSelectedFolder(e.target.value);
    setIsPlaying(false);
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
        Math.min(event.clientX - offset.x, window.innerWidth - 250)
      );
      const newY = Math.max(
        0,
        Math.min(event.clientY - offset.y, window.innerHeight - 250)
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

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        if (playerRef.current) {
          setSeek(playerRef.current.seek());
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleOnLoad = () => {
    setDuration(playerRef.current.duration());
  };

  const handleOnEnd = () => {
    if (currentAudioIndex < audioFiles.length - 1) {
      setCurrentAudioIndex(currentAudioIndex + 1);
    } else {
      setCurrentAudioIndex(0);
      setIsPlaying(false);
    }
  };

  const handleSeekChange = (event) => {
    const newTime = (event.target.value / 100) * duration;
    setSeek(newTime);
    playerRef.current.seek(newTime);
  };

  return (
    <div
      className="music-player-container"
      style={{ top: position.y, left: position.x, width: "250px" }}
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
      <div className="music-player-controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? (
            <i className="fas fa-pause"></i>
          ) : (
            <i className="fas fa-play"></i>
          )}
        </button>
      </div>
      <div className="playback-bar">
        <div className="progress-bar-container">
          <input
            type="range"
            min="0"
            max="100"
            value={(seek / duration) * 100}
            onChange={handleSeekChange}
          />
        </div>
        <div className="progress-time-container">
          <span className="progress-time">{`${formatTime(seek)} / ${formatTime(
            duration
          )}`}</span>
        </div>
      </div>
      {audioFiles.length > 0 && (
        <ReactHowler
          ref={playerRef}
          src={audioFiles[currentAudioIndex]}
          playing={isPlaying}
          html5={true}
          preload={true}
          onLoad={handleOnLoad}
          onEnd={handleOnEnd}
        />
      )}
    </div>
  );
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default MusicPlayer;
