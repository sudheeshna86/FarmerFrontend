import React, { useState, useEffect } from "react";
import { DollarSign, Loader, MapPin, Calendar, Truck } from "lucide-react";
import apiClient from "../../api/apiClient"; // Ensure path is correct

export default function DriverEarnings() {
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    orders: []
  });

  // --- FETCH REAL DATA ---
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        // ✅ Call the earnings endpoint
        const res = await apiClient.get("/driver/earnings");
        console.log("Driver Earnings Data:", res.data);
        setEarningsData(res.data);
      } catch (error) {
        console.error("Error fetching driver earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <Truck className="text-primary" size={28} />
        <h2 className="fw-bold text-dark mb-0">Driver Earnings</h2>
      </div>
      
      {/* 💰 Total Earnings Card */}
      <div className="card border-0 bg-primary bg-opacity-10 mb-4 p-4 rounded-4 shadow-sm d-flex flex-row align-items-center">
        <div className="bg-white p-3 rounded-circle me-3 shadow-sm">
          <DollarSign size={40} className="text-primary" />
        </div>
        <div>
          <h3 className="fw-bold mb-0 text-primary">
            ₹{earningsData.totalEarnings.toLocaleString('en-IN')}
          </h3>
          <p className="text-dark mb-0 fw-semibold">Total Delivery Earnings</p>
        </div>
      </div>

      {/* History Table */}
      <h4 className="fw-semibold mb-3">Delivery History</h4>
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3">Order ID</th>
                  <th style={{width: '30%'}}>Pickup (Farmer)</th>
                  <th style={{width: '30%'}}>Drop (Buyer)</th>
                  <th>Date</th>
                  <th className="text-end pe-4">Earning</th>
                </tr>
              </thead>
              <tbody>
                {earningsData.orders.length > 0 ? (
                  earningsData.orders.map((order) => (
                    <tr key={order.id}>
                      {/* Safe ID Check */}
                      <td className="ps-4 text-primary fw-bold">
                        #{String(order.id || order._id).slice(-6).toUpperCase()}
                      </td>
                      
                      {/* Pickup */}
                      <td>
                        <div className="d-flex align-items-start gap-2">
                          <MapPin size={16} className="text-danger mt-1 flex-shrink-0" />
                          <small className="text-muted">{order.pickupLocation}</small>
                        </div>
                      </td>

                      {/* Drop */}
                      <td>
                        <div className="d-flex align-items-start gap-2">
                          <MapPin size={16} className="text-success mt-1 flex-shrink-0" />
                          <small className="text-muted">{order.dropLocation}</small>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="text-muted small">
                        <div className="d-flex align-items-center gap-1">
                          <Calendar size={14} />
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </td>

                      {/* 💰 Earning Column */}
                      <td className="fw-bold text-success text-end pe-4">
                        + ₹{order.earning.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No completed deliveries found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}