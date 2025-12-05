import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export  const Card = ({ children, className = "", hover = false, onClick }) => {
  return (
    <div
      className={`bg-white rounded-4 border border-light shadow-sm ${
        hover ? "hover-shadow transition-all cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
      style={{
        transition: hover ? "box-shadow 0.2s ease-in-out" : "none",
      }}
      onMouseEnter={(e) => {
        if (hover) e.currentTarget.style.boxShadow = "0 0.75rem 1rem rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        if (hover) e.currentTarget.style.boxShadow = "0 0.125rem 0.25rem rgba(0, 0, 0, 0.05)";
      }}
    >
      {children}
    </div>
  );
};


