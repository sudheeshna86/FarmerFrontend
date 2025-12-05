import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Check, X, MessageSquare, User } from "lucide-react";
import {
  getFarmerOffers,
  acceptOffer as apiAcceptOffer,
  rejectOffer as apiRejectOffer,
  counterOffer as apiCounterOffer,
} from "../../api/Farmerlist";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("offers"); // offers | counters
  const [showCounter, setShowCounter] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await getFarmerOffers();
      console.log("📦 Offers from server:", data);

      const mapped = (data || []).map((o) => ({
        id: o._id,
        listingId: o.listing?._id,
        crop: o.listing?.cropName || "—",
        buyerName: o.buyer?.name || "Unknown Buyer",
        buyerPhone: o.buyer?.phone || "",
        qty: o.quantity || 0,
        priceOffered: o.offeredPrice ?? 0,
        listingPrice: o.listing?.pricePerKg ?? null,
        message: o.notes || "",
        status: o.status?.toLowerCase().trim() || "pending",
        lastActionBy: o.lastActionBy || null, // ✅ include this
        received: o.createdAt || new Date(),
        counterPrice: o.counterOfferPrice ?? null,
        raw: o,
      }));
      setOffers(mapped);
    } catch (err) {
      console.error("❌ Failed to fetch farmer offers:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Filter Offers and Counters
  const offersReceived = offers.filter(
    (o) => o.status?.toLowerCase() === "pending"
  );
  const counteredOffers = offers.filter(
    (o) => o.status?.toLowerCase() === "countered"
  );

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending") return "warning";
    if (s === "accepted") return "success";
    if (s === "rejected") return "danger";
    if (s === "countered") return "primary";
    return "secondary";
  };

  // 🟢 Accept Offer
  const handleAccept = async (offerId) => {
    if (!window.confirm("Accept this offer?")) return;
    try {
      setActionLoading(true);
      await apiAcceptOffer(offerId);
      await fetchOffers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to accept offer");
    } finally {
      setActionLoading(false);
    }
  };

  // 🟢 Reject Offer
  const handleReject = async (offerId) => {
    if (!window.confirm("Reject this offer?")) return;
    try {
      setActionLoading(true);
      await apiRejectOffer(offerId);
      await fetchOffers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject offer");
    } finally {
      setActionLoading(false);
    }
  };

  // 🟢 Open Counter Modal
  const openCounterModal = (offer) => {
    setSelectedOffer(offer);
    setCounterPrice(offer.counterPrice ?? "");
    setShowCounter(true);
  };

  // 🟢 Send Counter Offer
  const handleCounterSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOffer || !counterPrice || Number(counterPrice) <= 0) {
      alert("Please enter a valid counter price");
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        counterOfferPrice: Number(counterPrice),
        notes: `Farmer countered with ₹${counterPrice}/kg`,
      };
      await apiCounterOffer(selectedOffer.id, payload);
      await fetchOffers();
      setShowCounter(false);
      setSelectedOffer(null);
      setCounterPrice("");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send counter offer");
    } finally {
      setActionLoading(false);
    }
  };

  // 🟢 Offer Card (for both tabs)
  const renderOfferCard = (offer) => {
    const totalValue = (offer.qty || 0) * (offer.priceOffered || 0);
    const isFarmerCountered =
      offer.status === "countered" && offer.lastActionBy === "farmer";
    const isBuyerCountered =
      offer.status === "countered" && offer.lastActionBy === "buyer";

    return (
      <div className="col-12 col-sm-6 col-md-4" key={offer.id}>
        <Card className="p-3 shadow-sm border rounded-3 small">
          <div className="d-flex align-items-center mb-2">
            <User size={22} className="me-2 text-warning" />
            <span className="fw-bold">{offer.buyerName}</span>
            <span
              className={`badge bg-${getStatusColor(
                offer.status
              )} ms-auto text-capitalize`}
            >
              {isFarmerCountered
                ? "Countered by Me"
                : isBuyerCountered
                ? "Countered by Buyer"
                : offer.status}
            </span>
          </div>

          <div className="text-muted mb-1">{offer.crop}</div>

          <div className="my-2">
            <strong>{offer.qty} kg</strong>{" "}
            <span className="text-muted">Offered:</span>{" "}
            <span
              className={
                offer.priceOffered < (offer.listingPrice ?? Infinity)
                  ? "text-danger"
                  : "text-success"
              }
            >
              ₹{offer.priceOffered}/kg
            </span>{" "}
            {offer.listingPrice ? (
              <span className="text-muted">
                {" "}
                (Listed: ₹{offer.listingPrice})
              </span>
            ) : null}
          </div>

          <div className="mb-1">
            <span className="text-muted">Total: </span>
            <strong>₹{totalValue.toLocaleString()}</strong>
          </div>

          {offer.counterPrice && (
            <div className="text-info small mb-2">
              Buyer’s Counter: ₹{offer.counterPrice}/kg
            </div>
          )}

          <div className="small bg-light text-dark rounded p-2 mt-2">
            <strong>Message:</strong> {offer.message || "—"}
          </div>

          {/* 🔁 BUTTON / STATUS LOGIC */}
          <div className="d-flex gap-1 mt-3 flex-wrap">
            {/* 🟡 If Buyer Countered → Farmer can Accept / Reject / Counter */}
            {isBuyerCountered ? (
              <>
                <div className="text-warning small fw-semibold mb-2 w-100">
                  Buyer countered — awaiting your response
                </div>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleAccept(offer.id)}
                  disabled={actionLoading}
                >
                  <Check size={16} /> Accept
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleReject(offer.id)}
                  disabled={actionLoading}
                >
                  <X size={16} /> Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openCounterModal(offer)}
                  disabled={actionLoading}
                >
                  <MessageSquare size={16} /> Counter
                </Button>
              </>
            ) : isFarmerCountered ? (
              // 🟢 If Farmer Countered → Only show info
              <div className="text-primary small fw-semibold">
                Countered by you — awaiting buyer’s response
              </div>
            ) : offer.status === "pending" ? (
              // 🕓 New Offer — Accept / Reject / Counter
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleAccept(offer.id)}
                  disabled={actionLoading}
                >
                  <Check size={16} /> Accept
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleReject(offer.id)}
                  disabled={actionLoading}
                >
                  <X size={16} /> Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openCounterModal(offer)}
                  disabled={actionLoading}
                >
                  <MessageSquare size={16} /> Counter
                </Button>
              </>
            ) : offer.status === "accepted" ? (
              <div className="text-success small fw-semibold">Accepted</div>
            ) : offer.status === "rejected" ? (
              <div className="text-danger small fw-semibold">Rejected</div>
            ) : null}
          </div>

          <div className="mt-2 text-muted small">
            📞 Buyer Phone: {offer.buyerPhone || "—"}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">Offer Management</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "offers" ? "active fw-bold" : ""
            }`}
            onClick={() => setActiveTab("offers")}
          >
            💬 Offers Received
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "counters" ? "active fw-bold" : ""
            }`}
            onClick={() => setActiveTab("counters")}
          >
            🔁 Counters
          </button>
        </li>
      </ul>

      {/* Tab content */}
      {loading ? (
        <div className="text-center py-5 text-muted">Loading offers...</div>
      ) : activeTab === "offers" ? (
        offersReceived.length === 0 ? (
          <div className="text-center text-muted py-5">No pending offers.</div>
        ) : (
          <div className="row g-3">
            {offersReceived.map((offer) => renderOfferCard(offer))}
          </div>
        )
      ) : counteredOffers.length === 0 ? (
        <div className="text-center text-muted py-5">No countered offers.</div>
      ) : (
        <div className="row g-3">
          {counteredOffers.map((offer) => renderOfferCard(offer))}
        </div>
      )}

      {/* Counter Modal */}
      <Modal
        isOpen={showCounter}
        onClose={() => setShowCounter(false)}
        title="Send Counter Offer"
      >
        {selectedOffer && (
          <form onSubmit={handleCounterSubmit}>
            <div className="bg-light rounded-3 p-3 mb-3">
              <div className="fw-semibold fs-5 mb-1">{selectedOffer.crop}</div>
              <div className="small mb-1">
                <b>Buyer:</b> {selectedOffer.buyerName}
              </div>
              <div className="small mb-2">
                <b>Original Offer:</b> ₹{selectedOffer.priceOffered}/kg for{" "}
                {selectedOffer.qty} kg
              </div>
              {selectedOffer.counterPrice && (
                <div className="text-info small">
                  Buyer’s Last Counter: ₹{selectedOffer.counterPrice}/kg
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Counter Price (₹ per kg)</label>
              <input
                type="number"
                className="form-control"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                required
              />
            </div>

            <div className="alert alert-info mb-3 fw-semibold">
              Total: ₹
              {isNaN(counterPrice)
                ? "0"
                : (Number(counterPrice) * (selectedOffer.qty || 0)).toLocaleString()}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowCounter(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={actionLoading}>
                Send Counter Offer
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
