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
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import {
  getFarmerOffers,
  acceptOffer as apiAcceptOffer,
  rejectOffer as apiRejectOffer,
  counterOffer as apiCounterOffer,
} from "../../api/Farmerlist";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("offers");
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

      const mapped = (data || []).map((o) => {
        const counterOffers = o.counterOffers || [];
        const last = counterOffers[counterOffers.length - 1];
        console.log(o.listing.actualquantity)
        return {
          id: o._id,
          listingId: o.listing?._id,
          crop: o.listing?.cropName,
          buyerName: o.buyer?.name,
          buyerPhone: o.buyer?.phone,
          qty: o.quantity,
          priceOffered: o.offeredPrice,
          actualQuantity: o.listing.actualquantity, 
          listingPrice: o.listing?.pricePerKg,
          message: o.notes || "",
          status: o.status,
          received: o.createdAt,
          counterOffers,
          lastCounterBy: last?.counteredBy || null,
          lastCounterPrice: last?.price || null,
          raw: o,
        };
      });

      setOffers(mapped);
    } catch (err) {
      console.error("Error fetching offers", err);
    } finally {
      setLoading(false);
    }
  };

  const offersReceived = offers.filter((o) => o.status === "pending");
  const counteredOffers = offers.filter((o) => o.status === "countered");

  const handleAccept = async (id) => {
    if (!window.confirm("Accept this offer?")) return;
    try {
      setActionLoading(true);
      await apiAcceptOffer(id);
      fetchOffers();
    } catch (err) {
      alert("Failed to accept offer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this offer?")) return;
    try {
      setActionLoading(true);
      await apiRejectOffer(id);
      fetchOffers();
    } catch (err) {
      alert("Failed to reject offer");
    } finally {
      setActionLoading(false);
    }
  };

  const openCounterModal = (offer) => {
    setSelectedOffer(offer);
    setCounterPrice("");
    setShowCounter(true);
  };

  const handleCounterSubmit = async (e) => {
    e.preventDefault();
    if (!counterPrice || Number(counterPrice) <= 0) {
      alert("Enter valid price");
      return;
    }

    try {
      setActionLoading(true);
      await apiCounterOffer(selectedOffer.id, {
        counterOfferPrice: Number(counterPrice),
        notes: `Farmer countered with ₹${counterPrice}/kg`,
      });

      setShowCounter(false);
      setCounterPrice("");
      fetchOffers();
    } catch (err) {
      alert("Failed to send counter");
    } finally {
      setActionLoading(false);
    }
  };

  const renderOfferCard = (offer) => {
    const last = offer.counterOffers[offer.counterOffers.length - 1];
    const isCountered = offer.status === "countered";
    const isLastByBuyer = isCountered && last?.counteredBy === "buyer";
    const isLastByFarmer = isCountered && last?.counteredBy === "farmer";

    return (
      <div className="col-md-4" key={offer.id}>
        <Card className="p-3 shadow-sm rounded-3 small">
          <div className="d-flex align-items-center mb-2">
            <User size={20} className="me-2 text-warning" />
            <span className="fw-bold">{offer.buyerName}</span>
          </div>

          <div className="text-muted">{offer.crop}</div>

          <div className="my-2">
            <strong>{offer.qty} kg</strong> — Offered
            <span className="text-success"> Actual Price ₹{offer.actualQuantity}/kg</span>
          </div>

          {/* <div>
            Total: <strong>₹{offer.qty * offer.priceOffered}</strong>
          </div> */}

          {/* LAST COUNTER DISPLAY */}
          {/* CONVERSATION / MESSAGE HISTORY */}
<div className="bg-light rounded p-2 small mt-2">
  <strong>Messages:</strong>
  <div className="mt-1">
  
    {/* All counter history */}
    {offer.counterOffers?.length > 0 ? (
      offer.counterOffers.map((c, i) => (
        <div key={i} className="mt-1">
          {c.counteredBy === "buyer" ? (
            <span className="text-info">
              <b>Buyer:</b> Countered ₹{c.price}/kg<br></br>
              <b>Total:</b> ₹ {offer.qty*c.price}
            </span>
          ) : (
            <span className="text-primary">
              <b>You:</b> Countered ₹{c.price}/kg
            </span>
          )}
        </div>
      ))
    ) : (
      <div className="text-muted mt-1">No counters yet.</div>
    )}
  </div>
</div>


          <div className="d-flex gap-2 mt-3 flex-wrap">

            {/* PENDING → Accept + Reject only */}
            {offer.status === "pending" && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleAccept(offer.id)}
                >
                  <Check size={16} /> Accept
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleReject(offer.id)}
                >
                  <X size={16} /> Reject
                </Button>
              </>
            )}

            {/* COUNTERED → last by buyer → Accept + Reject + Counter */}
            {isLastByBuyer && (
              <>
                <div className="text-warning small w-100">
                  Buyer countered — respond below.
                </div>

                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleAccept(offer.id)}
                >
                  <Check size={16} /> Accept
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleReject(offer.id)}
                >
                  <X size={16} /> Reject
                </Button>

                {/* Counter button visible only inside countered tab */}
                {activeTab === "counters" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openCounterModal(offer)}
                  >
                    <MessageSquare size={16} /> Counter
                  </Button>
                )}
              </>
            )}

            {/* COUNTERED → last by farmer → waiting */}
            {isLastByFarmer && (
              <div className="text-primary small fw-semibold">
                You countered — waiting for buyer.
              </div>
            )}

            {/* DIRECT ACCEPTED / REJECTED */}
            {offer.status === "accepted" && (
              <div className="text-success small fw-semibold">Accepted ✔</div>
            )}

            {offer.status === "rejected" && (
              <div className="text-danger small fw-semibold">Rejected ❌</div>
            )}
          </div>

          <div className="mt-2 small text-muted">
            📞 {offer.buyerPhone || "—"}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">Offer Management</h2>

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

      {loading ? (
        <div className="text-center py-5 text-muted">Loading...</div>
      ) : activeTab === "offers" ? (
        offersReceived.length === 0 ? (
          <div className="text-center text-muted py-5">
            No pending offers.
          </div>
        ) : (
          <div className="row g-3">{offersReceived.map(renderOfferCard)}</div>
        )
      ) : counteredOffers.length === 0 ? (
        <div className="text-center text-muted py-5">
          No countered offers.
        </div>
      ) : (
        <div className="row g-3">{counteredOffers.map(renderOfferCard)}</div>
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
