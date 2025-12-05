import React, { useState } from 'react';

export default function DriverProfile() {
  const [formData, setFormData] = useState({
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    contact: '9876543210',
    vehicle: 'Truck 10T',
    license: 'DL1234567890',
    location: 'Punjab',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div>
      <h2>Profile</h2>
      <div className="card p-4">
        <form onSubmit={handleSubmit}>
          {['name', 'email', 'contact', 'vehicle', 'license', 'location'].map(field => (
            <div className="form-group mb-3" key={field}>
              <label className="form-label" htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                className="form-control"
                id={field}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                type={field === 'email' ? 'email' : 'text'}
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
