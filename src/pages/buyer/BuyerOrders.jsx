import React, { useState, useEffect } from "react";
import { MapPin, Clock, Package, Phone, User, Check, X, Truck } from "lucide-react";
import {
  createOrderFromOffer,
  getMyOrders,
  payForOrder,
} from "../../api/Orders";
import {
  getMyOffers,
  acceptCounterOffer,
  rejectCounterOffer,
  deleteOffer,
} from "../../api/BuyerOffers";
import "bootstrap/dist/css/bootstrap.min.css";
import { getReceipt } from "../../api/Orders";
import ReceiptModal from "../ReceiptModal";


export default function BuyerOrders() {
  const [activeTab, setActiveTab] = useState("offers");
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
const [receiptData, setReceiptData] = useState(null);


  useEffect(() => {
    fetchAllData();
  }, []);

  // 🔄 Fetch all offers + orders
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

  // 🗑 Remove rejected offer
  const handleRemove = async (offerId) => {
    if (!window.confirm("Remove this offer?")) return;
    try {
      await deleteOffer(offerId);
      setOffers((prev) => prev.filter((o) => o._id !== offerId));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove offer");
    }
  };

  // ✅ Buyer accepts farmer’s counter → order auto created (by backend)
  const handleAcceptCounter = async (offerId) => {
    try {
      await acceptCounterOffer(offerId);
      alert("✅ Counter accepted! Order created automatically.");
      await fetchAllData();
      setActiveTab("orders");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to accept counter");
    }
  };
  const handleViewReceipt = async (orderId) => {
  try {
    const data = await getReceipt(orderId);
    setReceiptData(data);
    setShowReceiptModal(true);
  } catch (err) {
    alert("Failed to load receipt");
  }
};


  // ❌ Buyer rejects counter
  const handleRejectCounter = async (offerId) => {
    try {
      await rejectCounterOffer(offerId);
      alert("❌ Counter rejected. Listing added back to marketplace.");
      await fetchAllData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject counter");
    }
  };

  // 💳 Make payment for an order
  const handlePayment = async (orderId) => {
    if (!window.confirm("Proceed with payment for this order?")) return;
    try {
      await payForOrder(orderId);
      alert("✅ Payment successful!");
      await fetchAllData();
    } catch (err) {
      alert(err?.response?.data?.message || "Payment failed");
    }
  };

  // 🎯 Offer status badge
  const getStatusBadge = (offer) => {
    const s = offer.status?.toLowerCase();

    if (s === "pending")
      return (
        <span className="badge bg-warning text-dark">Pending (Farmer)</span>
      );
    if (s === "accepted")
      return <span className="badge bg-success">Accepted</span>;
    if (s === "rejected")
      return <span className="badge bg-danger">Rejected</span>;
    if (s === "countered") {
      if (offer.lastActionBy === "farmer")
        return <span className="badge bg-primary">Farmer Countered</span>;
      if (offer.lastActionBy === "buyer")
        return (
          <span className="badge bg-info text-dark">
            You Countered (Waiting)
          </span>
        );
    }
    return <span className="badge bg-secondary">Unknown</span>;
  };

  // 🎯 Order status badge
  const getOrderStage = (status) => {
    const s = status?.toLowerCase();

    if (s === "pending_payment")
      return <span className="badge bg-warning text-dark">Awaiting Payment</span>;

    if (s === "paid")
      return <span className="badge bg-info text-dark">Paid — Awaiting Driver</span>;

    if (s === "driver_assigned")
      return <span className="badge bg-primary">Driver Assigned</span>;

    /* ⭐⭐ ADDED: OTP VERIFIED STATUS ⭐⭐ */
    if (s === "otp_verified")
      return <span className="badge bg-primary">OTP Verified</span>;

    if (s === "delivered")
      return <span className="badge bg-success">Delivered</span>;

    if (s === "completed")
      return <span className="badge bg-success">Completed ✅</span>;

    return <span className="badge bg-secondary">Processing</span>;
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-dark">My Orders & Offers</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "offers" ? "active fw-bold" : ""}`}
            onClick={() => setActiveTab("offers")}
          >
            💬 Offers
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "orders" ? "active fw-bold" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            🧾 Orders
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center text-muted py-5">Loading...</div>
      ) : activeTab === "offers" ? (
        /* ---------------- OFFERS TAB ---------------- */
        offers.length === 0 ? (
          <div className="text-center text-muted py-5">
            <Clock size={32} className="mb-3 text-secondary" />
            <h5>No offers yet</h5>
            <p>Your offers will appear here.</p>
          </div>
        ) : (
          <div className="row g-4">
            {offers.map((offer) => (
              <div className="col-md-6 col-lg-4" key={offer._id}>
                <div className="card shadow-sm border-0 h-100">
                  <img
                    src={
                      offer.listing?.imageUrl
                        ? offer.listing.imageUrl.startsWith("http")
                          ? offer.listing.imageUrl
                          : `http://localhost:5000${offer.listing.imageUrl}`
                        : "https://via.placeholder.com/400"
                    }
                    alt={offer.listing?.cropName || "Crop"}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h5 className="fw-bold text-dark mb-0">
                        {offer.listing?.cropName}
                      </h5>
                      {getStatusBadge(offer)}
                    </div>

                    <p className="text-muted small mb-2">
                      Category: {offer.listing?.category}
                    </p>
                    <p className="fw-semibold text-success mb-2">
                      ₹{offer.offeredPrice}/kg • {offer.quantity} kg
                    </p>

                    {/* Offer Status Logic */}
                    {offer.status === "pending" && (
                      <div className="alert alert-warning small">
                        Waiting for farmer’s response.
                      </div>
                    )}

                    {offer.status === "countered" &&
                      offer.lastActionBy === "buyer" && (
                        <div className="alert alert-info small">
                          You countered ₹{offer.counterOfferPrice}/kg — waiting
                          for farmer.
                        </div>
                      )}

                    {offer.status === "countered" &&
                      offer.lastActionBy === "farmer" && (
                        <>
                          <div className="alert alert-primary small">
                            Farmer countered ₹{offer.counterOfferPrice}/kg
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success flex-fill"
                              onClick={() => handleAcceptCounter(offer._id)}
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger flex-fill"
                              onClick={() => handleRejectCounter(offer._id)}
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        </>
                      )}

                    {offer.status === "rejected" && (
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-outline-danger flex-fill"
                          onClick={() => handleRemove(offer._id)}
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    <hr className="my-2" />

                    <div className="text-muted small d-flex align-items-center">
                      <User size={14} className="me-2 text-success" />
                      Farmer: {offer.listing?.farmer?.name || "N/A"}
                    </div>
                    <div className="text-muted small d-flex align-items-center">
                      <Phone size={14} className="me-2 text-success" />
                      {offer.listing?.farmer?.phone || "N/A"}
                    </div>
                    <div className="text-muted small mt-2">
                      <Clock size={14} className="me-1" />
                      {new Date(offer.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* ---------------- ORDERS TAB ---------------- */
        <div className="row g-4">
          {orders.length === 0 ? (
            <div className="text-center text-muted py-5">
              <Package size={32} className="mb-3 text-secondary" />
              <h5>No accepted orders yet</h5>
              <p>Once your offers are accepted, they appear here.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div className="col-md-6 col-lg-4" key={order._id}>
                <div className="card shadow-sm border-0 h-100">
                  <img
                    src={
                      order.listing?.imageUrl
                        ? order.listing.imageUrl.startsWith("http")
                          ? order.listing.imageUrl
                          : `http://localhost:5000${order.listing.imageUrl}`
                        : "https://via.placeholder.com/400"
                    }
                    alt={order.listing?.cropName || "Crop"}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold text-dark mb-1">
                      {order.listing?.cropName}
                    </h5>
                    <p className="fw-semibold text-success mb-2">
                      ₹{order.finalPrice}/kg • {order.quantity} kg
                    </p>

                    {/* 🟢 Order Stage */}
                    {getOrderStage(order.status)}

                    {/* 💳 Payment button */}
                    {order.status === "pending_payment" && (
                      <button
                        className="btn btn-success btn-sm mt-2 w-100"
                        onClick={() => handlePayment(order._id)}
                      >
                        💳 Make Payment
                      </button>
                    )}
                    {order.status !== "pending_payment" && (
  <button
    className="btn btn-outline-secondary btn-sm mt-2 w-100"
    onClick={() => handleViewReceipt(order._id)}
  >
    🧾 View Receipt
  </button>
)}


                    {/* 🚚 Driver Info */}
                    <div className="bg-light rounded-3 p-3 mt-3 mb-3">
                      <div className="text-success fw-semibold">
                        Pickup: {order.listing?.location || "N/A"}
                      </div>
                      <div className="text-danger fw-semibold mb-2">
                        Delivery: {order.buyer?.address || "—"}
                      </div>

                      {(order.status === "driver_assigned" ||
                        order.status === "otp_verified") &&
                        order.driver && (
                          <div className="mt-2 p-2 rounded bg-white border small">
                            <div className="text-dark fw-semibold">
                              🚚 Driver:{" "}
                              <span className="text-success">
                                {order.driver?.name || "N/A"}
                              </span>
                            </div>
                            <div className="text-dark fw-semibold">
                              📞 Phone:{" "}
                              <span className="text-primary">
                                {order.driver?.phone || "N/A"}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>

                    <hr className="my-2" />

                    <div className="text-muted small d-flex align-items-center">
                      <User size={14} className="me-2 text-success" />
                      Farmer: {order.farmer?.name || "N/A"}
                    </div>
                    <div className="text-muted small d-flex align-items-center">
                      <Phone size={14} className="me-2 text-success" />
                      {order.farmer?.phone || "N/A"}
                    </div>
                    <div className="text-muted small mt-2 d-flex align-items-center">
                      <MapPin size={14} className="me-2 text-success" />
                      {order.listing?.location || "N/A"}
                    </div>
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
      <ReceiptModal
  isOpen={showReceiptModal}
  onClose={() => setShowReceiptModal(false)}
  data={receiptData}
/>
    </div>
    
  );
}

