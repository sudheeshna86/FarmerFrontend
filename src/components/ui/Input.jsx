import React, { forwardRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export  const Input = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="w-100 mb-2">
      {label && (
        <label className="form-label fw-medium text-secondary mb-1">
          {label}
        </label>
      )}
   
      <input
        ref={ref}
        className={`form-control py-2 px-3 rounded-3 border ${
          error ? "border-danger" : "border-secondary-subtle"
        } ${className}`}
        style={{
          transition: "all 0.2s ease-in-out",
          boxShadow: "none",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#059669"; // emerald-500
          e.target.style.boxShadow = "0 0 0 0.2rem rgba(5, 150, 105, 0.25)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#dc3545" : "#dee2e6";
          e.target.style.boxShadow = "none";
        }}
        {...props}
      />

      {error && <p className="text-danger small mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

