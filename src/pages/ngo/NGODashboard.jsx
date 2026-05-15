import React from "react";
import { Heart, Package, Users, Calendar } from "lucide-react";

export default function NGODashboard() {
  const kpis = [
    { label: "Meals Served", value: "12,450", icon: <Users size={28} className="text-success" /> },
    { label: "Donations Accepted", value: "87", icon: <Heart size={28} className="text-danger" /> },
    { label: "Pending Pickups", value: "5", icon: <Package size={28} className="text-primary" /> },
    { label: "Active Volunteers", value: "24", icon: <Calendar size={28} className="text-warning" /> },
  ];

  const availableDonations = [
    {
      id: "1",
      crop: "Fresh Vegetables Mix",
      farmer: "Green Valley Farms",
      quantity: 80,
      unit: "kg",
      location: "Karnataka, 12 km away",
      freshness: 3,
      image:
        "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400",
      posted: "2 hours ago",
    },
    {
      id: "2",
      crop: "Surplus Tomatoes",
      farmer: "Sunrise Agriculture",
      quantity: 120,
      unit: "kg",
      location: "Maharashtra, 25 km away",
      freshness: 5,
      image:
        "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400",
      posted: "5 hours ago",
    },
    {
      id: "3",
      crop: "Potatoes",
      farmer: "Fresh Fields Co-op",
      quantity: 200,
      unit: "kg",
      location: "Punjab, 45 km away",
      freshness: 14,
      image:
        "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400",
      posted: "1 day ago",
    },
  ];

  const scheduledPickups = [
    {
      id: "1",
      crop: "Green Beans",
      farmer: "Organic Earth Farmers",
      quantity: 60,
      unit: "kg",
      pickupDate: "2025-10-24",
      pickupTime: "09:00 AM",
      location: "Tamil Nadu",
      status: "confirmed",
    },
    {
      id: "2",
      crop: "Carrots",
      farmer: "Highland Produce",
      quantity: 100,
      unit: "kg",
      pickupDate: "2025-10-25",
      pickupTime: "11:00 AM",
      location: "Himachal Pradesh",
      status: "pending",
    },
  ];

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h1 className="fw-bold fs-2 mb-2">Welcome Back!</h1>
        <p className="text-muted">Making a difference in our community together</p>
      </div>

      {/* KPIs */}
      <div className="row g-4 mb-5">
        {kpis.map((kpi, i) => (
          <div key={i} className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>{kpi.icon}</div>
                <div className="text-end">
                  <h3 className="fw-bold">{kpi.value}</h3>
                  <p className="text-muted small">{kpi.label}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Donations & Pickups */}
      <div className="row g-4 mb-5">
        {/* Available Donations */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h4 className="fw-bold mb-4">Available Donations</h4>
              <div className="d-flex flex-column gap-3">
                {availableDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="card border-0 shadow-sm overflow-hidden"
                  >
                    <div className="row g-0">
                      <div className="col-auto">
                        <img
                          src={donation.image}
                          alt={donation.crop}
                          className="img-fluid"
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="col">
                        <div className="card-body py-2">
                          <h5 className="fw-bold mb-1">{donation.crop}</h5>
                          <p className="text-muted small mb-1">{donation.farmer}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">
                              {donation.quantity} {donation.unit}
                            </span>
                            <span className="badge bg-success">
                              {donation.freshness} days fresh
                            </span>
                          </div>
                          <p className="text-muted small mt-1">{donation.location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-0 text-center">
                      <button className="btn btn-success w-100 btn-sm">
                        <Heart size={16} className="me-2" />
                        Accept Donation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Pickups */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h4 className="fw-bold mb-4">Scheduled Pickups</h4>
              <div className="d-flex flex-column gap-3">
                {scheduledPickups.map((pickup) => (
                  <div key={pickup.id} className="card border-0 shadow-sm p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-1">{pickup.crop}</h6>
                        <p className="text-muted small mb-0">{pickup.farmer}</p>
                      </div>
                      <span
                        className={`badge ${
                          pickup.status === "confirmed" ? "bg-success" : "bg-warning text-dark"
                        }`}
                      >
                        {pickup.status}
                      </span>
                    </div>
                    <div className="text-muted small">
                      <div className="mb-1">
                        <Calendar size={14} className="me-2" />
                        {pickup.pickupDate} at {pickup.pickupTime}
                      </div>
                      <div>
                        <Package size={14} className="me-2" />
                        {pickup.quantity} {pickup.unit}
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-outline-secondary btn-sm w-50">
                        View Details
                      </button>
                      <button className="btn btn-primary btn-sm w-50">
                        Upload Proof
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact This Month */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="fw-bold mb-4">Impact This Month</h4>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 bg-success bg-opacity-10 rounded">
                <h3 className="fw-bold text-success">2,340 kg</h3>
                <p className="text-muted small mb-0">Food Distributed</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-primary bg-opacity-10 rounded">
                <h3 className="fw-bold text-primary">12,450</h3>
                <p className="text-muted small mb-0">People Fed</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-warning bg-opacity-10 rounded">
                <h3 className="fw-bold text-warning">45 tons</h3>
                <p className="text-muted small mb-0">CO₂ Saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
