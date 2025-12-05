import React from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Package, CheckCircle, DollarSign, MapPin } from "lucide-react";

export default function DriverDashboard() {
  const navigate = useNavigate();

  const user = { id: 1, full_name: "Mike Driver" };

  const myDeliveries = [
    {
      id: 1,
      crop: "Fresh Strawberries",
      address: "123 Farm Road, Rural County",
      order_number: "#8-A1B2C3",
      status: "assigned",
    },
  ];

  const availableDeliveries = [
    {
      id: 2,
      crop: "Organic Tomatoes",
      address: "123 Farm Road, Rural County",
      delivery_address: "456 Market Street, City Center",
      amount: 350,
    },
  ];

  const activeDeliveries = myDeliveries.length;
  const completedToday = 0;
  const availableJobs = availableDeliveries.length;
  const onTimeRate = 98;

  return (
    <div className="bg-white min-vh-100">
      {/* Header */}
      <nav className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm border-bottom bg-white">
        <div className="d-flex align-items-center">
          <img
            alt="AgriConnect"
            src="https://agriconnect.agri/assets/logo-green.svg"
            style={{ height: 36, marginRight: 12 }}
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className="fw-bold fs-4 text-dark">AgriConnect</span>
        </div>
        <div className="d-flex align-items-center gap-4">
          <span className="text-muted fw-semibold">{user.full_name}</span>
          <div
            style={{
              width: 36,
              height: 36,
              background: "#eee",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
            }}
          >
            <span style={{ color: "#34955d" }}>{user.full_name[0]}</span>
          </div>
        </div>
      </nav>

      <div className="container my-4">
        <h1 className="fw-bold mb-1">Driver Dashboard</h1>
        <div className="mb-3 text-muted">Welcome back, {user.full_name}</div>

        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2 text-muted small">
                  <span>Active Deliveries</span>
                  <Truck size={20} />
                </div>
                <div className="fs-1 fw-bold">{activeDeliveries}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2 text-muted small">
                  <span>Completed Today</span>
                  <CheckCircle size={20} className="text-success" />
                </div>
                <div className="fs-1 fw-bold">{completedToday}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2 text-muted small">
                  <span>Available Jobs</span>
                  <Package size={20} className="text-warning" />
                </div>
                <div className="fs-1 fw-bold">{availableJobs}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2 text-muted small">
                  <span>On-time Rate</span>
                  <DollarSign size={20} className="text-success" />
                </div>
                <div className="fs-1 fw-bold">{onTimeRate}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h4 className="fw-bold mb-3">My Deliveries</h4>
                {myDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="border rounded bg-light p-3 mb-3"
                    onClick={() => navigate(`/driver/delivery/${delivery.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="fw-semibold mb-1">{delivery.crop}</div>
                    <div className="d-flex align-items-center text-muted small mb-1">
                      <MapPin size={16} className="me-1" /> {delivery.address}
                    </div>
                    <div className="text-secondary small mb-2">
                      {delivery.order_number}
                    </div>
                    <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 small">
                      {delivery.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Available Deliveries</h4>
                {availableDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="border rounded bg-light-blue p-3 mb-3"
                  >
                    <div className="fw-semibold mb-1">{delivery.crop}</div>
                    <div className="d-flex align-items-center text-muted small mb-1">
                      <MapPin size={16} className="me-1" />
                      {delivery.address} → {delivery.delivery_address}
                    </div>
                    <div className="text-success fw-bold mb-2">
                      ${delivery.amount.toLocaleString()}
                    </div>
                    <button className="btn btn-primary w-100 fw-semibold">
                      Accept Delivery
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
