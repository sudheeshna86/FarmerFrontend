import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  CheckCircle, Package, Clock, DollarSign, TrendingUp, ShoppingBag, MoreVertical, ArrowRight 
} from "lucide-react";
import apiClient from "../../api/apiClient"; // ✅ Ensure this path matches your project structure

export default function FarmerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedOrders: 0,
    activeListings: 0,
    pendingOffers: 0,
    totalEarnings: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  // --- FETCH REAL DASHBOARD DATA ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
            apiClient.get("/farmer/stats"),       
            apiClient.get("/farmer/orders/recent") 
        ]);

        console.log("Stats Data:", statsRes.data);
        console.log("Orders Data:", ordersRes.data);

        setStats(statsRes.data);
        setRecentOrders(ordersRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s === "completed" || s === "paid" || s === "delivered") return "bg-success";
    if (s === "pending" || s === "pending_payment" || s === "awaiting driver") return "bg-warning text-dark";
    if (s === "shipped" || s === "dispatched") return "bg-info text-dark";
    if (s === "cancelled") return "bg-danger";
    return "bg-secondary";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 className="fw-bold text-dark mb-1">Farmer Overview</h2>
                <p className="text-muted mb-0">Here's what's happening with your farm listings today.</p>
            </div>
            <button className="btn btn-primary d-flex align-items-center gap-2">
                <Package size={18} /> Create New Listing
            </button>
        </div>

        {/* === STATS CARDS (Added Back) === */}
        <div className="row g-3 mb-4">
            {/* Card 1: Completed Orders */}
            <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #198754'}}>
                    <div className="card-body p-3 d-flex align-items-center justify-content-between">
                        <div>
                            <h6 className="text-muted small text-uppercase fw-bold mb-1">Completed Orders</h6>
                            <h2 className="mb-0 fw-bold text-success">{stats.completedOrders}</h2>
                        </div>
                        <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success"><CheckCircle size={28} /></div>
                    </div>
                </div>
            </div>

            {/* Card 2: Active Listings */}
            <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #0d6efd'}}>
                    <div className="card-body p-3 d-flex align-items-center justify-content-between">
                        <div>
                            <h6 className="text-muted small text-uppercase fw-bold mb-1">Active Listings</h6>
                            <h2 className="mb-0 fw-bold text-primary">{stats.activeListings}</h2>
                        </div>
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary"><ShoppingBag size={28} /></div>
                    </div>
                </div>
            </div>

             {/* Card 3: Pending Offers */}
             <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #ffc107'}}>
                    <div className="card-body p-3 d-flex align-items-center justify-content-between">
                        <div>
                            <h6 className="text-muted small text-uppercase fw-bold mb-1">Pending Offers</h6>
                            <h2 className="mb-0 fw-bold text-warning">{stats.pendingOffers}</h2>
                        </div>
                        <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning"><Clock size={28} /></div>
                    </div>
                </div>
            </div>

            {/* Card 4: Total Earnings */}
            <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #0dcaf0'}}>
                    <div className="card-body p-3 d-flex align-items-center justify-content-between">
                        <div>
                            <h6 className="text-muted small text-uppercase fw-bold mb-1">Total Earnings</h6>
                            <h2 className="mb-0 fw-bold text-info">₹{(stats.totalEarnings || 0).toLocaleString('en-IN')}</h2>
                        </div>
                        <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info"><DollarSign size={28} /></div>
                    </div>
                </div>
            </div>
        </div>

        {/* === RECENT ORDERS TABLE === */}
        <div className="row">
            <div className="col-12">
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                            <TrendingUp size={20} className="text-primary"/> Recent Orders
                        </h5>
                        <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1">
                            View All <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover table-striped mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Order ID</th>
                                    <th>Product</th>
                                    <th>Buyer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="ps-4 fw-bold text-primary">
                                            {order._id}
                                        </td>
                                        <td>
                                            <span className="fw-semibold">
                                                {order.productName || "Unknown Product"}
                                            </span>
                                        </td>
                                        <td>
                                            {order.buyerName || "Unknown Buyer"}
                                        </td>
                                        <td className="fw-bold">
                                            ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill ${getStatusBadge(order.status)} px-3 py-2`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="text-muted small">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td>
                                            <button className="btn btn-light btn-sm text-muted">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {recentOrders.length === 0 && (
                                    <tr><td colSpan="7" className="text-center py-4">No recent orders found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}