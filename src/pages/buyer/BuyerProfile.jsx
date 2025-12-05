import React, { useState } from 'react';
export default function BuyerProfile() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    contact: '9876543210',
    address: 'Delhi, India',
    businessType: 'Retailer'
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
          <div className="form-group mb-3">
            <label>Name</label>
            <input className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group mb-3">
            <label>Contact</label>
            <input className="form-control" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
          </div>
          <div className="form-group mb-3">
            <label>Address</label>
            <input className="form-control" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </div>
          <div className="form-group mb-3">
            <label>Business Type</label>
            <input className="form-control" value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
