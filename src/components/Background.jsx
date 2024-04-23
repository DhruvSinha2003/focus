import React, { useState } from "react";
import a from "../assets/images/a.png";
import b from "../assets/images/b.jpg";
import c from "../assets/images/c.jpg";
import d from "../assets/images/d.jpg";
import e from "../assets/images/e.png";

const Background = () => {
  const [backgroundImage, setBackgroundImage] = useState("");

  const defaultImages = [a, b, c, d, e];

  // Render default image thumbnails
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
    <div>
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt="Background"
          style={{ maxWidth: "100%" }}
        />
      ) : (
        <div>
          <p>Select a background image:</p>
          {defaultImageThumbnails}
        </div>
      )}
    </div>
  );
};

export default Background;
