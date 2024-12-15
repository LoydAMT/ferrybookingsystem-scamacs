import React, { useState } from "react";

export const styles = {
  avatarHello: {
    position: "absolute",
    bottom: "80px",
    right: "10px",
    backgroundColor: "#0866FF",
    color: "white",
    padding: "10px 15px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    transition: "opacity 0.3s ease",
  },
  chatWithMeButton: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    backgroundImage:
      "url('https://i.pinimg.com/736x/77/d0/10/77d010471d917c115521c05add2d4854.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
};

const Avatar = (props) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={props.style} className="avatar-container">
      <div
        className="transition-3"
        style={{
          ...styles.avatarHello,
          opacity: hovered ? "1" : "0",
        }}
      >
        Hey, it's Ruru!
      </div>

      {/* Image-based chat icon */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => props.onClick && props.onClick()}
        className="transition-3"
        style={{
          ...styles.chatWithMeButton,
          border: hovered ? "1px solid #f9f0ff" : "4px solid #0866FF",
        }}
      />
    </div>
  );
};

export default Avatar;
