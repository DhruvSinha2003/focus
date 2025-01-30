import React, { useEffect, useRef, useState } from "react";
import ReactHowler from "react-howler";

// Import audio files
import * as cafeAmbientFiles from "../music/cafe_ambient/jazz_cafe.mp3";
import * as lofiFiles from "../music/lofi/lofi.mp3";
import * as whiteNoiseFiles from "../music/white_noise/white_noise.mp3";

const audioFilesMappings = {
  lofi: Object.values(lofiFiles),
  cafe_ambient: Object.values(cafeAmbientFiles),
  white_noise: Object.values(whiteNoiseFiles),
};

const MusicPlayer = () => {
  const [selectedFolder, setSelectedFolder] = useState("lofi");
  const [audioFiles, setAudioFiles] = useState(audioFilesMappings.lofi);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 344,
    y: 192,
  });
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

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDragging) {
        const newX = Math.max(
          0,
          Math.min(event.clientX - offset.x, window.innerWidth - 320)
        );
        const newY = Math.max(
          0,
          Math.min(event.clientY - offset.y, window.innerHeight - 200)
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className="music-player-container glass-panel"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: "absolute",
        top: 0,
        left: 0,
        width: "320px",
        height: "250px",
      }}
    >
      <div className="music-player-heading" onMouseDown={handleMouseDown}>
        <h2>Music Player</h2>
      </div>

      <select
        className="music-player-select"
        value={selectedFolder}
        onChange={handleFolderChange}
      >
        <option value="lofi">Lofi</option>
        <option value="cafe_ambient">Cafe Ambient</option>
        <option value="white_noise">White Noise</option>
      </select>

      <div className="music-player-controls">
        <button className="icon-button" onClick={handlePlayPause}>
          <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
        </button>
      </div>

      <div className="playback-bar">
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${(seek / duration) * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={(seek / duration) * 100 || 0}
            onChange={handleSeekChange}
          />
        </div>
        <div className="progress-time">
          <span>{formatTime(seek)}</span>
          <span>{formatTime(duration)}</span>
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

export default MusicPlayer;
