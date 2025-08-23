import React from "react";
import "./RoomImages.css";

interface RoomImagesProps {
  images: string[];
}

const RoomImages: React.FC<RoomImagesProps> = ({ images }) => {
  if (!images || images.length === 0) return null;

  const layoutClass =
    images.length === 1 ? "one" : images.length === 2 ? "two" : "three";

  return (
    <div className={`room-images ${layoutClass}`}>
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Room image ${idx + 1}`}
          className="room-image-preview"
          onError={() => console.warn("❌ Failed to load image:", img)}
        />
      ))}
    </div>
  );
};

export default RoomImages;
