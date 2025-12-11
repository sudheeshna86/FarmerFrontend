import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  CreditCard, 
  Truck, 
  Search, 
  ChevronRight,
  AlertCircle
} from "lucide-react";

// ✅ Import the API function we created
import {getBuyerDashboardData} from "../../api/BuyerList";

export default function BuyerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State matching your backend response structure
  const [stats, setStats] = useState({
    totalOrders: 0,
    ongoingOrders: 0,
    totalSpend: 0,
    savedSuppliers: 0
  });
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);

  // --- 1. FETCH DATA ON MOUNT ---
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getBuyerDashboardData();
        
        // Debug: Check console to ensure data structure matches
        console.log("Buyer API Response:", data);

        setStats(data.stats);
        setOngoingOrders(data.ongoingOrders);
        setRecentHistory(data.recentHistory);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // --- 2. STATUS BADGE HELPER ---
  // Maps your specific DB statuses to Bootstrap colors
  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "";
    
    // Green: Success/Done
    if (["delivered", "completed", "paid", "otp_verified"].includes(s)) 
      return "bg-success";
    
    // Blue: Moving/Active
    if (["in_transit", "driver_assigned"].includes(s)) 
      return "bg-info text-dark";
    
    // Yellow: Waiting/Pending
    if (["pending_payment", "awaiting_driver_accept", "pending"].includes(s)) 
      return "bg-warning text-dark";
    
    // Red: Failed
    if (["cancelled", "failed", "rejected"].includes(s)) 
      return "bg-danger";
      
    return "bg-secondary";
  };

  // --- 3. STATUS TEXT FORMATTER ---
  // Turns "pending_payment" into "Pending Payment"
  const formatStatus = (status) => {
    if (!status) return "";
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container py-5 text-center">
      <div className="alert alert-danger d-inline-flex align-items-center gap-2">
        <AlertCircle size={20} /> {error}
      </div>
    </div>
  );

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* === HEADER === */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Buyer Overview</h2>
            <p className="text-muted mb-0">Track your orders and procurement activity.</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2">
            <Search size={18} /> Browse Marketplace
          </button>
        </div>

        {/* === STATS CARDS === */}
        <div className="row g-3 mb-4">
          {/* Card 1: Total Orders */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <ShoppingBag className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-muted small mb-0 text-uppercase fw-bold">Total Orders</p>
                  <h3 className="fw-bold mb-0">{stats.totalOrders}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Ongoing Orders */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{borderBottom: "4px solid #ffc107"}}>
              <div className="card-body d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                  <Truck className="text-warning" size={24} />
                </div>
                <div>
                  <p className="text-muted small mb-0 text-uppercase fw-bold">Ongoing Orders</p>
                  <h3 className="fw-bold mb-0">{stats.ongoingOrders}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Total Spend */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                  <CreditCard className="text-success" size={24} />
                </div>
                <div>
                  <p className="text-muted small mb-0 text-uppercase fw-bold">Total Spend</p>
                  <h3 className="fw-bold mb-0">₹{stats.totalSpend.toLocaleString('en-IN')}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Saved Suppliers */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                  <CheckCircle className="text-danger" size={24} />
                </div>
                <div>
                  <p className="text-muted small mb-0 text-uppercase fw-bold">Active Farmers</p>
                  <h3 className="fw-bold mb-0">{stats.savedSuppliers}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === SECTION 1: ONGOING ORDERS === */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold d-flex align-items-center text-warning">
              <Clock className="me-2" size={20}/> Ongoing Orders
            </h5>
          </div>
          <div className="card-body p-0">
            {ongoingOrders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-4">Order ID</th>
                      <th>Product</th>
                      <th>Farmer</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ongoingOrders.map(order => (
                      <tr key={order.id}>
                        <td className="ps-4 fw-bold text-primary">#{String(order.id).slice(-6).toUpperCase()}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                             {/* Optional: Add Image here if available */}
                            <span className="fw-semibold">{order.product}</span>
                          </div>
                        </td>
                        <td>{order.farmer}</td>
                        <td>
                          <span className={`badge rounded-pill ${getStatusBadge(order.status)} px-3 py-2`}>
                            {formatStatus(order.status)}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="fw-bold">₹{order.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-5 text-center text-muted">
                <p className="mb-0">No active orders right now.</p>
              </div>
            )}
          </div>
        </div>

        {/* === SECTION 2: RECENT HISTORY === */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold d-flex align-items-center text-secondary">
              <ShoppingBag className="me-2" size={20}/> Recent History
            </h5>
            <button className="btn btn-sm btn-link text-decoration-none">View All</button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4">Order ID</th>
                    <th>Product</th>
                    <th>Farmer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentHistory.map(order => (
                    <tr key={order.id}>
                      <td className="ps-4 text-muted">#{String(order.id).slice(-6).toUpperCase()}</td>
                      <td>{order.product}</td>
                      <td>{order.farmer}</td>
                      <td className="text-muted small">{new Date(order.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge rounded-pill ${getStatusBadge(order.status)} px-2`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td>₹{order.amount.toLocaleString('en-IN')}</td>
                      <td className="text-end pe-3">
                        <button className="btn btn-sm btn-light text-muted">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {recentHistory.length === 0 && (
                      <tr><td colSpan="7" className="text-center py-4 text-muted">No past order history found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}