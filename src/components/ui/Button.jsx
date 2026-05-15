import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'btn btn-success text-white fw-medium shadow-sm',
    secondary: 'btn btn-primary text-white fw-medium shadow-sm',
    outline: 'btn btn-outline-secondary fw-medium',
    ghost: 'btn btn-light text-secondary fw-medium border-0',
    danger: 'btn btn-danger text-white fw-medium shadow-sm',
  };

  const sizes = {
    sm: 'btn-sm px-3 py-1',
    md: 'px-4 py-2',
    lg: 'btn-lg px-5 py-3 fs-5',
  };

  return (
    <button
      {...props}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      disabled={props.disabled}
      style={{
        transition: 'all 0.2s ease-in-out',
        borderRadius: '0.5rem',
        opacity: props.disabled ? 0.6 : 1,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}
    