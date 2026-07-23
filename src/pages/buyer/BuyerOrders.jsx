import React, { useState, useEffect } from "react";
import { useChat } from "../../contexts/ChatContext";
import {
  MapPin,
  Clock,
  Package,
  Phone,
  User,
  Check,
  X,
  MessageSquare,
  Trash2,
  AlertCircle,
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
  const [offerPage, setOfferPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [offerTotalPages, setOfferTotalPages] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [offerStatus, setOfferStatus] = useState("all");
  const [orderStatus, setOrderStatus] = useState("all");
  
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [counterPrice, setCounterPrice] = useState("");
  
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const { openChatWithUser, setIsOpen } = useChat();

  useEffect(() => {
    fetchAllData();
  }, [offerPage, orderPage, offerStatus, orderStatus, activeTab]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [offersData, ordersData] = await Promise.all([
        getMyOffers({ page: offerPage, limit: 6, status: offerStatus }),
        getMyOrders({ page: orderPage, limit: 6, status: orderStatus }),
      ]);
      setOffers(offersData?.offers || []);
      setOfferTotalPages(offersData?.totalPages || 1);
      setOrders(ordersData?.orders || []);
      setOrderTotalPages(ordersData?.totalPages || 1);
    } catch (err) {
      console.error("❌ Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

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
      setActiveTab("orders");
      fetchAllData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to accept counter");
    }
  };

  const handleRejectCounter = async (offerId) => {
    try {
      await rejectCounterOffer(offerId);
      fetchAllData();
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
      if (!order) return;
      
      setReceiptData({
        ...data,
        status: order.status,
        orderId: order._id,
        crop: order.listing?.cropName || "N/A",
        quantity: order.quantity,
        pricePerKg: order.finalPrice,
        buyerId: order.buyer?._id,
        buyerName: order.buyer?.name,
        buyerPhone: order.buyer?.phone,
        buyerAddress: order.buyer?.address,
        farmerId: order.farmer?._id,
        farmerName: order.farmer?.name,
        farmerPhone: order.farmer?.phone,
        farmerAddress: order.farmer?.address,
        transactionId: order.paymentInfo?.transactionId || "N/A",
      });
      setShowReceiptModal(true);
    } catch (err) {
      alert("Failed to load receipt");
    }
  };

  const handleOpenCancelModal = (order) => {
    setOrderToCancel(order);
    setCancelReason("");
    setShowCancelOrderModal(true);
  };

  const handleSubmitCancelOrder = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;

    try {
      setActionLoading(true);
      await apiClient.put(`/orders/${orderToCancel._id}/cancel`, {
        reason: cancelReason
      });
      setShowCancelOrderModal(false);
      fetchAllData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (offer) => {
    const s = offer.status?.toLowerCase();
    switch(s) {
      case "pending": return <span className="badge bg-warning text-dark">Pending</span>;
      case "accepted": return <span className="badge bg-success">Accepted</span>;
      case "rejected": return <span className="badge bg-danger">Rejected</span>;
      case "countered":
        const last = offer.counterOffers?.[offer.counterOffers.length - 1];
        if (!last) return <span className="badge bg-secondary">Countered</span>;
        return last.counteredBy === "farmer" 
          ? <span className="badge bg-primary">Farmer Countered ₹{last.price}</span>
          : <span className="badge bg-info text-dark">You Countered ₹{last.price}</span>;
      default: return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const getOrderStage = (status) => {
    const s = status?.toLowerCase();
    const stages = {
      pending_payment: { class: "bg-warning text-dark", text: "Awaiting Payment" },
      paid: { class: "bg-info text-dark", text: "Paid — Processing" },
      driver_assigned: { class: "bg-primary", text: "Driver Assigned" },
      delivered: { class: "bg-success", text: "Delivered" },
      completed: { class: "bg-success", text: "Completed" },
      cancelled: { class: "bg-danger", text: "Cancelled" }
    };
    const stage = stages[s] || { class: "bg-secondary", text: "Processing" };
    return <span className={`badge ${stage.class}`}>{stage.text}</span>;
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-dark">My Orders & Offers</h2>

      <div className="card p-3 mb-4 shadow-sm border-0">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label small mb-1 fw-bold text-muted">View Category</label>
            <select className="form-select" value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
              <option value="offers">Offers</option>
              <option value="orders">Orders</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small mb-1 fw-bold text-muted">Filter By Status</label>
            <select 
              className="form-select" 
              value={activeTab === "offers" ? offerStatus : orderStatus}
              onChange={(e) => {
                if (activeTab === "offers") { setOfferStatus(e.target.value); setOfferPage(1); }
                else { setOrderStatus(e.target.value); setOrderPage(1); }
              }}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="countered">Countered</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="col-md-4">
            <button className="btn btn-success w-100" onClick={fetchAllData}>Refresh List</button>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4 border-0">
        <li className="nav-item">
          <button className={`nav-link border-0 ${activeTab === "offers" ? "active fw-bold text-success border-bottom border-3 border-success" : "text-muted"}`} onClick={() => setActiveTab("offers")}>
            💬 Offers
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link border-0 ${activeTab === "orders" ? "active fw-bold text-success border-bottom border-3 border-success" : "text-muted"}`} onClick={() => setActiveTab("orders")}>
            🧾 Orders
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-success" role="status"></div></div>
      ) : activeTab === "offers" ? (
        <div className="row g-4">
            {offers.length === 0 && <div className="text-center text-muted py-5">No offers found.</div>}
            {offers.map((offer) => (
              <div className="col-md-6 col-lg-4" key={offer._id}>
                <div className="card shadow-sm border-0 h-100">
                  <img
                    src={offer.listing?.imageUrl?.startsWith("http") ? offer.listing.imageUrl : `http://localhost:5000${offer.listing?.imageUrl || ""}`}
                    alt="Crop"
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                    onError={(e) => e.target.src = "https://via.placeholder.com/400"}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold mb-0 text-truncate" style={{maxWidth: '150px'}}>{offer.listing?.cropName}</h5>
                      {getStatusBadge(offer)}
                    </div>
                    <p className="small text-muted mb-2">
                      Listed: ₹{offer.listing?.pricePerKg}/kg <br />
                      Offered: <span className="text-success fw-bold">₹{offer.offeredPrice}/kg</span> • {offer.quantity}kg
                    </p>

                    <div className="bg-light p-2 rounded mb-3" style={{fontSize: '0.85rem'}}>
                        {offer.counterOffers?.length > 0 ? (
                            offer.counterOffers.slice(-1).map((c, i) => (
                                <div key={i} className={c.counteredBy === 'farmer' ? 'text-primary' : 'text-info'}>
                                    <strong>{c.counteredBy === 'farmer' ? 'Farmer' : 'You'}:</strong> ₹{c.price}/kg (Total: ₹{offer.quantity * c.price})
                                </div>
                            ))
                        ) : <span className="text-muted">No counter offers</span>}
                    </div>

                    <div className="d-flex gap-2">
                        {offer.status === "pending" && (
                            <button className="btn btn-sm btn-outline-danger w-100" onClick={() => handleRemove(offer._id)}>Withdraw</button>
                        )}
                        {offer.status === "countered" && offer.counterOffers?.slice(-1)[0]?.counteredBy === "farmer" && (
                            <>
                                <button className="btn btn-sm btn-success flex-fill" onClick={() => handleAcceptCounter(offer._id)}><Check size={14}/></button>
                                <button className="btn btn-sm btn-outline-danger flex-fill" onClick={() => handleRejectCounter(offer._id)}><X size={14}/></button>
                                <button className="btn btn-sm btn-primary flex-fill" onClick={() => openBuyerCounterModal(offer)}><MessageSquare size={14}/></button>
                            </>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="row g-4">
          {orders.length === 0 ? (
            <div className="text-center text-muted py-5"><h5>No orders found</h5></div>
          ) : (
            orders.map((order) => (
              <div className="col-md-6 col-lg-4" key={order._id}>
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="fw-bold">{order.listing?.cropName || "Deleted Crop"}</h5>
                    <p className="text-success fw-bold mb-2">₹{order.finalPrice}/kg • {order.quantity}kg</p>
                    {getOrderStage(order.status)}
                    
                    {order.status === "cancelled" && (
                        <div className="alert alert-danger small mt-2 p-2">
                             <AlertCircle size={14} className="me-1"/> {order.cancellationReason || "Cancelled"}
                        </div>
                    )}

                    <div className="mt-3 d-flex gap-2">
                        {order.status === "pending_payment" ? (
                            <>
                                <button className="btn btn-primary btn-sm flex-fill" onClick={() => handleViewReceipt(order._id)}>Pay Now</button>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleOpenCancelModal(order)}><Trash2 size={16}/></button>
                                <button className="btn btn-outline-success btn-sm" onClick={async () => {
                                  setIsOpen(true);
                                  await openChatWithUser(order.farmer, "farmer");
                                }}>💬</button>
                            </>
                        ) : (
                            order.status !== "cancelled" && (
                                <button className="btn btn-outline-secondary btn-sm w-100" onClick={() => handleViewReceipt(order._id)}>Receipt</button>
                            )
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Counter Modal */}
      <Modal isOpen={showCounterModal} onClose={() => setShowCounterModal(false)} title="Counter Offer">
        {selectedOffer && (
            <form onSubmit={submitBuyerCounter}>
                <div className="mb-3">
                    <label className="form-label small">New Price per Kg</label>
                    <input type="number" className="form-control" value={counterPrice} onChange={(e) => setCounterPrice(e.target.value)} required />
                </div>
                <div className="p-2 bg-light mb-3 rounded">Total: ₹{Number(counterPrice || 0) * selectedOffer.quantity}</div>
                <Button variant="success" className="w-100" type="submit" disabled={actionLoading}>
                    {actionLoading ? "Sending..." : "Submit Counter"}
                </Button>
            </form>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={showCancelOrderModal} onClose={() => setShowCancelOrderModal(false)} title="Cancel Order">
        {orderToCancel && (
            <form onSubmit={handleSubmitCancelOrder}>
                <p className="text-danger small">Are you sure? This will return stock to the farmer.</p>
                <textarea className="form-control mb-3" placeholder="Reason..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} required />
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" className="flex-fill" onClick={() => setShowCancelOrderModal(false)}>Close</Button>
                    <Button variant="danger" className="flex-fill" type="submit" disabled={actionLoading}>Confirm</Button>
                </div>
            </form>
        )}
      </Modal>

      {receiptData && (
          <ReceiptModal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} data={receiptData} refresh={fetchAllData} />
      )}
    </div>
  );
}