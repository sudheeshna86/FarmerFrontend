import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    contact: "9876543210",
    address: "Village Khanna, Punjab",
    farmLocation: "Punjab",
    crops: "Wheat, Rice, Corn"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">Profile</h2>
      <Card className="p-4 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label>Name</label>
              <input className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label>Email</label>
              <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label>Contact</label>
              <input className="form-control" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label>Address</label>
              <input className="form-control" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label>Farm Location</label>
              <input className="form-control" value={formData.farmLocation} onChange={(e) => setFormData({...formData, farmLocation: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label>Crops Grown</label>
              <input className="form-control" value={formData.crops} onChange={(e) => setFormData({...formData, crops: e.target.value})} />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
