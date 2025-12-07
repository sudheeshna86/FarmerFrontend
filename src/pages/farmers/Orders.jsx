import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Truck, Phone, User, Clock, AlertCircle } from "lucide-react"; // Added AlertCircle icon

import {
  getFarmerOrders,
  assignDriver,
  getDrivers,
  getReceipt,
} from "../../api/Orders";

import ReceiptModal from "../ReceiptModal";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // driver modal
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  // receipt
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  /* ------------------------------------------ */
  /* FETCH FARMER ORDERS */
  /* ------------------------------------------ */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getFarmerOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch farmer orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  /* ------------------------------------------ */
  /* FETCH DRIVERS */
  /* ------------------------------------------ */
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDrivers();
        setDrivers(data || []);
      } catch (err) {
        console.error("Failed to load drivers:", err);
      }
    };
    fetchDrivers();
  }, []);

  /* ------------------------------------------ */
  /* ASSIGN DRIVERS */
  /* ------------------------------------------ */
  const handleAssignDriver = async () => {
    if (selectedDrivers.length === 0) {
      alert("Select at least one driver");
      return;
    }

    try {
      await assignDriver(selectedOrder._id, selectedDrivers);

      alert("Drivers invited! Waiting for someone to accept.");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id
            ? { ...o, status: "awaiting_driver_accept", invitedDrivers: selectedDrivers }
            : o
        )
      );

      setShowDriverModal(false);
      setSelectedOrder(null);
      setSelectedDrivers([]);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to assign drivers");
    }
  };

  /* ------------------------------------------ */
  /* RECEIPT VIEW */
  /* ------------------------------------------ */
  const handleViewReceipt = async (orderId) => {
    try {
      setReceiptLoading(true);
      const data = await getReceipt(orderId);
      setReceiptData(data);
      setShowReceiptModal(true);
    } catch (err) {
      alert("Failed to load receipt");
    } finally {
      setReceiptLoading(false);
    }
  };

  /* ------------------------------------------ */
  /* STATUS BADGES */
  /* ------------------------------------------ */
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending_payment") return { color: "warning text-dark", label: "Pending Payment" };
    if (s === "paid") return { color: "info text-dark", label: "Paid — Assign Drivers" };
    if (s === "awaiting_driver_accept") return { color: "secondary", label: "Waiting for Drivers" };
    if (s === "driver_assigned") return { color: "primary", label: "Driver Accepted" };
    if (s === "in_transit") return { color: "primary", label: "In Transit" };
    if (s === "delivered") return { color: "success", label: "Delivered" };
    if (s === "completed") return { color: "success", label: "Completed ✔" };
    // 🔴 Added Cancelled Status
    if (s === "cancelled") return { color: "danger", label: "Cancelled ❌" }; 
    return { color: "secondary", label: "Processing" };
  };

  /* ------------------------------------------ */
  /* UI */
  /* ------------------------------------------ */
  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">My Orders</h2>

      {loading ? (
        <div className="text-center text-muted py-5">Loading...</div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => {
            const { color, label } = getStatusBadge(order.status);
            console.log(order)
            return (
              <div key={order._id} className="col-md-4">
                <Card className="p-4 shadow-sm rounded-3">
                  {/* header */}
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={
                        order.listing?.imageUrl
                          ? order.listing.imageUrl.startsWith("http")
                            ? order.listing.imageUrl
                            : `http://localhost:5000${order.listing.imageUrl}`
                          : "https://via.placeholder.com/400"
                      }
                      className="rounded me-3"
                      style={{ width: 70, height: 70, objectFit: "cover" }}
                    />
                    <div>
                      <h5 className="fw-bold text-success">{order.listing?.cropName}</h5>
                      <div className="text-muted small">
                        {order.quantity} kg • ₹{order.finalPrice}/kg
                      </div>
                    </div>
                    <span className={`ms-auto badge bg-${color}`}>{label}</span>
                  </div>

                  {/* buyer */}
                  <div className="small d-flex align-items-center mb-2">
                    <User size={15} className="me-2 text-success" />
                    Buyer: {order.buyer?.name}
                  </div>
                  <div className="small d-flex align-items-center mb-2">
                    <Phone size={15} className="me-2 text-success" />
                    {order.buyer?.phone}
                  </div>

                  {/* location */}
                  <div className="bg-light p-3 rounded mb-3">
                    <div className="text-success fw-semibold" style={{ fontSize: "0.75rem" }}>
                      Pickup: {order.farmer.address}
                    </div>
                    <div className="text-danger fw-semibold" style={{ fontSize: "0.75rem" }}>
                      Delivery: {order.buyer?.address || "—"}
                    </div>
                  </div>

                  {/* 🔴 CANCELLED ALERT (New Addition) */}
                  {order.status === "cancelled" ? (
                    <div className="alert alert-danger p-2 mb-3">
                      <div className="fw-bold d-flex align-items-center mb-1">
                        <AlertCircle size={16} className="me-2"/> Order Cancelled By Buyer 
                      </div>
                      <div className="small text-dark">
                        Reason: {order.cancellationReason || "No reason provided."}
                      </div>
                    </div>
                  ) : (
                    /* NORMAL ACTION BUTTONS (Only if NOT cancelled) */
                    <>
                      {order.status === "pending_payment" && (
                        <div className="alert alert-warning text-center">
                          Waiting for buyer to pay
                        </div>
                      )}

                      {order.status !== "pending_payment" && (
                        <div className="d-flex gap-2">
                          {order.status === "paid" && (
                            <Button
                              variant="success"
                              className="w-100"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowDriverModal(true);
                              }}
                            >
                              <Truck size={18} /> Assign Drivers
                            </Button>
                          )}

                          <Button
                            variant="outline-secondary"
                            className="w-100"
                            onClick={() => handleViewReceipt(order._id)}
                          >
                            🧾 View Receipt
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  <div className="text-end small text-muted mt-2">
                    <Clock size={13} className="me-1" />
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* DRIVER ASSIGN MODAL */}
      <Modal
        isOpen={showDriverModal}
        onClose={() => {
          setShowDriverModal(false);
          setSelectedDrivers([]);
        }}
        title="Assign Drivers"
        size="md"
      >
        {drivers.length === 0 ? (
          <div className="text-center py-3">No drivers available</div>
        ) : (
          drivers.map((driver) => (
            <div key={driver._id} className="border rounded p-3 mb-2 d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-3"
                checked={selectedDrivers.includes(driver._id)}
                onChange={(e) =>
                  e.target.checked
                    ? setSelectedDrivers([...selectedDrivers, driver._id])
                    : setSelectedDrivers(selectedDrivers.filter((id) => id !== driver._id))
                }
              />
              <div>
                <div className="fw-bold">{driver.name}</div>
                <div className="small text-secondary">📞 {driver.phone}</div>
                <div className="small text-secondary">📍 {driver.address}</div>
              </div>
            </div>
          ))
        )}

        <div className="text-end mt-3">
          <Button
            variant="secondary"
            onClick={() => {
              setShowDriverModal(false);
              setSelectedDrivers([]);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            className="ms-2"
            disabled={selectedDrivers.length === 0}
            onClick={handleAssignDriver}
          >
            Invite
          </Button>
        </div>
      </Modal>

      {/* RECEIPT */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        data={receiptData}
      />

    </div>
  );
}