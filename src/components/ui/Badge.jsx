import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Badge({ children, variant = 'default', size = 'md' }) {
  const variants = {
    default: 'bg-light text-dark',
    success: 'bg-success-subtle text-success fw-semibold',
    warning: 'bg-warning-subtle text-warning fw-semibold',
    danger: 'bg-danger-subtle text-danger fw-semibold',
    info: 'bg-info-subtle text-info fw-semibold',
  };

  const sizes = {
    sm: 'px-2 py-0 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`d-inline-flex align-items-center rounded-pill ${variants[variant]} ${sizes[size]}`}
      style={{ fontWeight: 500 }}
    >
      {children}
    </span>
  );
}
