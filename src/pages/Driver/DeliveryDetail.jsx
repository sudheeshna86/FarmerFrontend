import React, { useEffect, useState } from "react";
import { MapPin, Phone } from "lucide-react";
import {
  getAvailableDeliveries,
  getMyDeliveries,
  acceptDelivery,
  declineDelivery,
  completeDelivery, // ⭐ NEW IMPORT
} from "../../api/Driver";
import { verifyDeliveryOTP } from "../../api/Orders";

export default function DriverDeliveries() {
  const [activeTab, setActiveTab] = useState("available");
  const [available, setAvailable] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [otpModal, setOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [a, m] = await Promise.all([
        getAvailableDeliveries(),
        getMyDeliveries(),
      ]);
      setAvailable(a || []);
      setMyDeliveries(m || []);
    } catch (err) {
      console.error("Failed to load:", err);
    }
    setLoading(false);
  };

  const handleAccept = async (orderId) => {
    if (!window.confirm("Accept this delivery?")) return;

    try {
      await acceptDelivery(orderId);
      alert("Delivery accepted!");
      await loadData();
      setActiveTab("my");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to accept delivery");
    }
  };

  const handleDecline = async (orderId) => {
    if (!window.confirm("Are you sure you want to decline?")) return;

    try {
      await declineDelivery(orderId);
      alert("Declined successfully");
      setAvailable((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert(err?.response?.data?.message || "Decline failed");
    }
  };

  const openOtpModal = (orderId) => {
    setSelectedOrderId(orderId);
    setOtpModal(true);
  };

  const submitOtp = async () => {
    if (!otpValue.trim()) {
      alert("Enter OTP");
      return;
    }

    try {
      await verifyDeliveryOTP(selectedOrderId, otpValue);
      alert("OTP Verified Successfully!");
      setOtpValue("");
      setOtpModal(false);
      await loadData();
    } catch (err) {
      alert(err?.response?.data?.message || "OTP verification failed");
    }
  };

  const finishDelivery = async (orderId) => {
    if (!window.confirm("Mark this delivery as completed?")) return;

    try {
      await completeDelivery(orderId);
      alert("Delivery Completed Successfully!");
      await loadData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to complete delivery");
    }
  };

  if (loading)
    return <div className="text-center py-5">Loading deliveries...</div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Driver Deliveries</h2>

      {/* TABS */}
      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn ${
            activeTab === "available" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("available")}
        >
          Available Deliveries
        </button>

        <button
          className={`btn ${
            activeTab === "my" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("my")}
        >
          My Deliveries
        </button>
      </div>

      {/* ========================= AVAILABLE DELIVERIES ========================= */}
      {activeTab === "available" && (
        <>
          {available.length === 0 ? (
            <div className="text-center text-muted py-4">
              No available deliveries.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
                gap: "22px",
              }}
            >
              {available.map((order) => {
                const isTaken = order.driver !== null;

                return (
                  <div
                    className="card shadow-sm p-3"
                    key={order._id}
                    style={{
                      borderRadius: "14px",
                      border: "1px solid #eee",
                    }}
                  >
                    {/* IMAGE */}
                    <div
                      style={{
                        width: "100%",
                        height: "185px",
                        overflow: "hidden",
                        borderRadius: "10px",
                      }}
                    >
                      <img
                        src={
                          order.listing?.imageUrl?.startsWith("http")
                            ? order.listing.imageUrl
                            : `http://localhost:5000${order.listing?.imageUrl}`
                        }
                        alt="Crop"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <h4 className="fw-bold text-success mt-3 mb-2">
                      {order.listing?.cropName}
                    </h4>

                    <div className="small mb-2">
                      <strong>Quantity:</strong> {order.quantity} kg <br />
                      <strong>Price:</strong> ₹{order.finalPrice}/kg <br />
                      <strong>Total:</strong>{" "}
                      ₹{order.quantity * order.finalPrice}
                    </div>

                    <div className="small mt-2">
                      <strong>Farmer:</strong> {order.farmer?.name} <br />
                      <Phone size={14} /> {order.farmer?.phone}
                    </div>

                    <div className="small mt-2">
                      <strong>Buyer:</strong> {order.buyer?.name} <br />
                      <Phone size={14} /> {order.buyer?.phone}
                    </div>

                    <div className="small mt-3">
                      <MapPin size={16} className="me-2 text-success" />
                      Pickup: {order.farmer?.address}
                    </div>

                    <div className="small mt-1 mb-3">
                      <MapPin size={16} className="me-2 text-danger" />
                      Delivery: {order.buyer?.address}
                    </div>

                    <div className="d-flex gap-2 mt-2">
                      {!isTaken ? (
                        <>
                          <button
                            className="btn btn-success w-50"
                            onClick={() => handleAccept(order._id)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-outline-danger w-50"
                            onClick={() => handleDecline(order._id)}
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className="badge bg-danger w-100 p-2">
                          Accepted by another driver
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ========================= MY DELIVERIES ========================= */}
      {activeTab === "my" && (
        <>
          {myDeliveries.length === 0 ? (
            <div className="text-center text-muted py-4">
              No active deliveries.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
                gap: "22px",
              }}
            >
              {myDeliveries.map((order) => (
                <div
                  className="card shadow-sm p-3"
                  key={order._id}
                  style={{
                    borderRadius: "14px",
                    border: "1px solid #eee",
                  }}
                >
                  {/* IMAGE */}
                  <div
                    style={{
                      width: "100%",
                      height: "185px",
                      overflow: "hidden",
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src={
                        order.listing?.imageUrl?.startsWith("http")
                          ? order.listing.imageUrl
                          : `http://localhost:5000${order.listing?.imageUrl}`
                      }
                      alt="Crop"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <h4 className="fw-bold mt-3">{order.listing?.cropName}</h4>

                  <div className="small mb-2">
                    <strong>Quantity:</strong> {order.quantity} kg <br />
                    <strong>Price:</strong> ₹{order.finalPrice}/kg <br />
                    <strong>Total:</strong>{" "}
                    ₹{order.quantity * order.finalPrice}
                  </div>

                  <div className="small mt-2">
                    <MapPin size={16} className="me-2 text-success" />
                    Pickup: {order.farmer?.address}
                  </div>

                  <div className="small mt-2">
                    <MapPin size={16} className="me-2 text-danger" />
                    Delivery: {order.buyer?.address}
                  </div>

                  <div className="small mt-2">
                    <Phone size={16} className="me-2 text-primary" />
                    Buyer: {order.buyer?.phone}
                  </div>

                  {/* ⭐ ADDED — STATUS BADGES */}
                  <div className="badge bg-primary mt-3 p-2">
                    {order.status === "driver_assigned" && "Driver Assigned"}
                    {order.status === "otp_verified" && "OTP Verified ✔"} {/* ⭐ ADDED */}
                    {order.status === "in_transit" && "In Transit"} {/* ⭐ ADDED */}
                    {order.status === "delivered" && "Delivered ✔"} {/* ⭐ ADDED */}
                  </div>

                  {/* ENTER OTP BUTTON */}
                  {order.status === "driver_assigned" && (
                    <button
                      className="btn btn-dark w-100 mt-3"
                      onClick={() => openOtpModal(order._id)}
                    >
                      Enter Delivery OTP
                    </button>
                  )}

                  {/* COMPLETE DELIVERY BUTTON */}
                  {order.status === "otp_verified" && (
                    <button
                      className="btn btn-success w-100 mt-3"
                      onClick={() => finishDelivery(order._id)}
                    >
                      Complete Delivery
                    </button>
                  )}

                  {/* STATUS DELIVERED */}
                  {order.status === "delivered" && (
                    <div className="alert alert-success mt-3 text-center">
                      Delivery Completed ✔
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* OTP MODAL */}
      {otpModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5 className="mb-2">Enter Delivery OTP</h5>

              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
              />

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setOtpModal(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-success" onClick={submitOtp}>
                  Submit OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
