import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "modal-dialog modal-sm",
    md: "modal-dialog modal-md",
    lg: "modal-dialog modal-lg",
    xl: "modal-dialog modal-xl",
  };

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        className={`d-flex align-items-center justify-content-center min-vh-100`}
      >
        <div
          className={`${sizeClasses[size]} modal-dialog-centered`}
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
        >
          <div
            className="modal-content rounded-4 shadow-lg border-0"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            {title && (
              <div className="modal-header border-bottom border-light-subtle">
                <h5 className="modal-title fw-bold fs-4">{title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                  style={{ filter: "invert(50%)" }}
                >
                  <X size={20} />
                </button>
              </div>
            )}

            <div className="modal-body p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

