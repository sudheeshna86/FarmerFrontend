import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Package,
  Phone,
  User,
  Check,
  X,
  MessageSquare,
  Trash2, // Import Trash Icon
  AlertCircle // Import Alert Icon
} from "lucide-react";
import {
  getMyOrders,
  payForOrder,
  getReceipt,
} from "../../api/Orders";
import {
  getMyOffers,
  acceptCounterOffer,
  rejectCounterOffer,
  deleteOffer,
  buyerCounterOffer,
} from "../../api/BuyerOffers";
// Import your API client to make the cancel call
import apiClient from "../../api/apiClient"; 
import "bootstrap/dist/css/bootstrap.min.css";
import ReceiptModal from "../ReceiptModal";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";

export default function BuyerOrders() {
  const [activeTab, setActiveTab] = useState("offers");
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  // Offer Counter state
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [counterPrice, setCounterPrice] = useState("");
  
  // 🆕 CANCEL ORDER STATE
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [offersData, ordersData] = await Promise.all([
        getMyOffers(),
        getMyOrders(),
      ]);
      setOffers(offersData || []);
      setOrders(ordersData || []);
    } catch (err) {
      console.error("❌ Failed to load offers/orders:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EXISTING HANDLERS (Offers) ---------------- */
  const handleRemove = async (offerId) => {
    if (!window.confirm("Remove this offer?")) return;
    try {
      await deleteOffer(offerId);
      setOffers((prev) => prev.filter((o) => o._id !== offerId));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove offer");
    }
  };

  const handleAcceptCounter = async (offerId) => {
    try {
      await acceptCounterOffer(offerId);
      alert("✅ Counter accepted! Order created.");
      await fetchAllData();
      setActiveTab("orders");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to accept counter");
    }
  };

  const handleRejectCounter = async (offerId) => {
    try {
      await rejectCounterOffer(offerId);
      alert("❌ Counter rejected.");
      await fetchAllData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject counter");
    }
  };

  const openBuyerCounterModal = (offer) => {
    setSelectedOffer(offer);
    setCounterPrice("");
    setShowCounterModal(true);
  };

  const submitBuyerCounter = async (e) => {
    e.preventDefault();
    if (!counterPrice || Number(counterPrice) <= 0) {
      alert("Enter valid price");
      return;
    }
    try {
      setActionLoading(true);
      await buyerCounterOffer({
        listingId: selectedOffer.listing._id,
        counterOfferPrice: Number(counterPrice),
        quantity: selectedOffer.quantity,
      });
      setShowCounterModal(false);
      setCounterPrice("");
      fetchAllData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send counter");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewReceipt = async (orderId) => {
    try {
      const data = await getReceipt(orderId);
      const order = orders.find((o) => o._id === orderId);
      setReceiptData({
        ...data,
        status: order.status,
        orderId: order._id,
        crop: order.listing.cropName,
        quantity: order.quantity,
        pricePerKg: order.finalPrice,
        buyerId: order.buyer._id,
        buyerName: order.buyer.name,
        buyerPhone: order.buyer.phone,
        buyerAddress: order.buyer.address,
        farmerId: order.farmer._id,
        farmerName: order.farmer.name,
        farmerPhone: order.farmer.phone,
        farmerAddress: order.farmer.address,
        transactionId: order.paymentInfo?.transactionId || "N/A",
      });
      setShowReceiptModal(true);
    } catch (err) {
      alert("Failed to load receipt");
    }
  };

  /* ---------------- 🆕 NEW CANCEL ORDER HANDLERS ---------------- */
  
  // 1. Open Modal
  const handleOpenCancelModal = (order) => {
    setOrderToCancel(order);
    setCancelReason(""); // Reset reason
    setShowCancelOrderModal(true);
  };

  // 2. Submit Cancellation
  const handleSubmitCancelOrder = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }

    try {
      setActionLoading(true);
      // Call backend API to cancel
      await apiClient.put(`/orders/${orderToCancel._id}/cancel`, {
        reason: cancelReason
      });

      alert("Order cancelled successfully.");
      setShowCancelOrderModal(false);
      fetchAllData(); // Refresh UI
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (offer) => {
    const s = offer.status?.toLowerCase();
    if (s === "pending") return <span className="badge bg-warning text-dark">Pending</span>;
    if (s === "accepted") return <span className="badge bg-success">Accepted</span>;
    if (s === "rejected") return <span className="badge bg-danger">Rejected</span>;
    if (s === "countered") {
      const last = offer.counterOffers?.[offer.counterOffers.length - 1];
      if (!last) return <span className="badge bg-secondary">Countered</span>;
      if (last.counteredBy === "farmer") return <span className="badge bg-primary">Farmer Countered ₹{last.price}/kg</span>;
      if (last.counteredBy === "buyer") return <span className="badge bg-info text-dark">You Countered ₹{last.price}/kg</span>;
    }
    return <span className="badge bg-secondary">Unknown</span>;
  };

  const getOrderStage = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending_payment") return <span className="badge bg-warning text-dark">Awaiting Payment</span>;
    if (s === "paid") return <span className="badge bg-info text-dark">Paid — Awaiting Driver</span>;
    if (s === "driver_assigned") return <span className="badge bg-primary">Driver Assigned</span>;
    if (s === "otp_verified") return <span className="badge bg-primary">OTP Verified</span>;
    if (s === "delivered") return <span className="badge bg-success">Delivered</span>;
    if (s === "completed") return <span className="badge bg-success">Completed</span>;
    // 🆕 Cancelled Badge
    if (s === "cancelled") return <span className="badge bg-danger">Cancelled</span>;
    return <span className="badge bg-secondary">Processing</span>;
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-dark">My Orders & Offers</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "offers" ? "active fw-bold" : ""}`} onClick={() => setActiveTab("offers")}>
            💬 Offers
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "orders" ? "active fw-bold" : ""}`} onClick={() => setActiveTab("orders")}>
            🧾 Orders
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center text-muted py-5">Loading...</div>
      ) : activeTab === "offers" ? (
        /* ... OFFERS TAB CONTENT (UNCHANGED) ... */
        <div className="row g-4">
            {/* (Your existing offer map code here - kept hidden for brevity as requested only changes for order) */}
            {offers.length === 0 && <div className="text-center text-muted py-5">No offers yet</div>}
            {offers.map((offer) => {
                 /* ... Existing Offer Card logic ... */
                 // Just rendering a placeholder to keep context
                 return <div key={offer._id} className="col-md-6 col-lg-4"><div className="card p-3">Offer for {offer.listing?.cropName}</div></div>
            })}
        </div>
      ) : (
        /* ---------------- ORDERS TAB ---------------- */
        <div className="row g-4">
          {orders.length === 0 ? (
            <div className="text-center text-muted py-5">
              <Package size={32} className="mb-3 text-secondary" />
              <h5>No accepted orders yet</h5>
            </div>
          ) : (
            orders.map((order) => (
              <div className="col-md-6 col-lg-4" key={order._id}>
                <div className="card shadow-sm border-0 h-100">
                  <img
                    src={order.listing?.imageUrl || "https://via.placeholder.com/400"}
                    alt={order.listing?.cropName}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold text-dark mb-1">{order.listing?.cropName}</h5>
                    <p className="fw-semibold text-success mb-2">
                      ₹{order.finalPrice}/kg • {order.quantity} kg
                    </p>

                    {getOrderStage(order.status)}

                    {/* 🔴 CANCELLATION REASON DISPLAY */}
                    {order.status === "cancelled" && (
                        <div className="alert alert-danger small mt-2 p-2">
                            <div className="fw-bold"><AlertCircle size={14}/> Reason:</div>
                            {order.cancellationReason || "No reason provided."}
                        </div>
                    )}

                    {/* 🟡 PENDING PAYMENT: Show PAY & CANCEL */}
                    {order.status === "pending_payment" && (
                        <div className="d-flex gap-2 mt-2">
                            <button
                                className="btn btn-primary btn-sm flex-fill"
                                onClick={() => handleViewReceipt(order._id)}
                            >
                                📄 Pay Now
                            </button>
                            
                            {/* 🆕 CANCEL BUTTON */}
                            <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleOpenCancelModal(order)}
                                title="Cancel Order"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}

                    {/* 🟢 OTHER STATUSES: Show RECEIPT ONLY */}
                    {order.status !== "pending_payment" && order.status !== "cancelled" && (
                      <button
                        className="btn btn-outline-secondary btn-sm mt-2 w-100"
                        onClick={() => handleViewReceipt(order._id)}
                      >
                        🧾 View Receipt
                      </button>
                    )}

                    <hr className="my-2" />
                    {/* ... (Existing footer info) ... */}
                    <div className="text-muted small mt-2">
                      <Clock size={14} className="me-1" />
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ... (Buyer Counter Modal - UNCHANGED) ... */}

      {/* 🆕 CANCEL ORDER MODAL */}
      <Modal
        isOpen={showCancelOrderModal}
        onClose={() => setShowCancelOrderModal(false)}
        title="Cancel Order"
      >
        <form onSubmit={handleSubmitCancelOrder} className="p-1">
            <div className="alert alert-warning small">
                Warning: Cancelling this order will release the stock back to the farmer.
            </div>
            
            <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">Reason for Cancellation</label>
                <textarea 
                    className="form-control"
                    rows="3"
                    placeholder="e.g., Changed my mind, Found better price..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                ></textarea>
            </div>

            <div className="d-flex gap-2 justify-content-end">
                <Button 
                    variant="outline-secondary" 
                    onClick={() => setShowCancelOrderModal(false)}
                    type="button"
                >
                    Keep Order
                </Button>
                <Button 
                    variant="danger" 
                    type="submit"
                    disabled={actionLoading}
                >
                    {actionLoading ? "Cancelling..." : "Confirm Cancel"}
                </Button>
            </div>
        </form>
      </Modal>

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        data={receiptData}
        refresh={fetchAllData}
      />
    </div>
  );
}