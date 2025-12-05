import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Check, X, Package, MessageSquare } from "lucide-react";
import {
  getMyOffers,
  acceptCounterOffer,
  rejectCounterOffer,
} from "../../api/BuyerOffers";

export default function BuyerOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  // 🟢 Fetch all offers (hide accepted ones)
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await getMyOffers();
      console.log("Fetched Offers:", data);
      // Filter out accepted offers
      setOffers((data || []).filter((o) => o.status !== "accepted"));
    } catch (err) {
      console.error("❌ Failed to fetch buyer offers:", err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Accept farmer’s counter → remove from offers (order will appear in Orders)
const handleAcceptCounter = async (offerId) => {
  if (!window.confirm("Accept the farmer's counter?")) return;
  try {
    setActionLoading(true);
    await acceptCounterOffer(offerId);
    alert("✅ Offer accepted! Order created successfully.");
    await fetchOffers(); // 🔁 Refresh — accepted ones vanish
  } catch (err) {
    alert(err?.response?.data?.message || "Failed to accept counter");
  } finally {
    setActionLoading(false);
  }
};

  // ❌ Reject farmer’s counter → remove offer
  const handleRejectCounter = async (offerId) => {
    if (!window.confirm("Reject the farmer's counter?")) return;
    try {
      setActionLoading(true);
      await rejectCounterOffer(offerId);
      alert("❌ Counter rejected. Listing added back to marketplace.");
      // Remove rejected offer locally
      setOffers((prev) => prev.filter((o) => o._id !== offerId));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject counter");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3 text-muted">Loading your offers...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">My Offers</h3>
          <small className="text-muted">
            Offers you made and responses from farmers
          </small>
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="text-center text-muted py-5">
          You have no active offers.
        </div>
      ) : (
        <div className="row g-3">
          {offers.map((o) => {
            const listing = o.listing || {};
            const farmer = listing.farmer || {};
            const total =
              (o.quantity || 0) *
              (o.counterOfferPrice || o.offeredPrice || 0);
            const isCountered = o.status === "countered";
            const isRejected = o.status === "rejected";
            const isPending = o.status === "pending";
            const lastActionBy = o.lastActionBy || null;

            return (
              <div className="col-12 col-md-6 col-lg-4" key={o._id}>
                <Card className="p-3 shadow-sm">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="mb-0">{listing.cropName || "Listing"}</h5>
                      <small className="text-muted">
                        {farmer.name || "Farmer"}
                      </small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-success">
                        ₹{o.offeredPrice}/kg
                      </div>
                      <small className="text-muted">for {o.quantity} kg</small>
                    </div>
                  </div>

                  <div className="mb-2 text-muted small">
                    <div>
                      <Package size={14} className="me-1" />{" "}
                      {listing.location || "—"}
                    </div>
                    <div>
                      Listed price:{" "}
                      {listing.pricePerKg
                        ? `₹${listing.pricePerKg}/kg`
                        : "—"}
                    </div>
                  </div>

                  {/* 🧠 Conditional Offer Status Display */}
                  {isCountered && (
                    <>
                      {lastActionBy === "farmer" && (
                        <div className="alert alert-info small mb-2">
                          <strong>Farmer countered:</strong> ₹
                          {o.counterOfferPrice}/kg
                        </div>
                      )}

                      {lastActionBy === "buyer" && (
                        <div className="alert alert-warning small mb-2">
                          <strong>You countered:</strong> ₹
                          {o.counterOfferPrice}/kg — waiting for farmer’s
                          response
                        </div>
                      )}
                    </>
                  )}

                  {/* 🧾 Action Buttons */}
                  <div className="d-flex gap-2 mt-2">
                    {isCountered && lastActionBy === "farmer" ? (
                      <>
                        <Button
                          variant="success"
                          onClick={() => handleAcceptCounter(o._id)}
                          disabled={actionLoading}
                        >
                          <Check size={14} /> Accept
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleRejectCounter(o._id)}
                          disabled={actionLoading}
                        >
                          <X size={14} /> Reject
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => setShowDetails(o)}
                          disabled={actionLoading}
                        >
                          <MessageSquare size={14} /> Details
                        </Button>
                      </>
                    ) : isCountered && lastActionBy === "buyer" ? (
                      <>
                        <Button variant="outline-secondary" disabled>
                          Waiting for farmer
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => setShowDetails(o)}
                        >
                          <MessageSquare size={14} /> Details
                        </Button>
                      </>
                    ) : isPending ? (
                      <>
                        <Button variant="outline-secondary" disabled>
                          Waiting for farmer
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => setShowDetails(o)}
                        >
                          <MessageSquare size={14} /> Details
                        </Button>
                      </>
                    ) : isRejected ? (
                      <div className="badge bg-danger w-100">
                        Rejected by farmer
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-3 small text-muted">
                    Farmer phone: {farmer.phone || "—"}
                    <br />
                    Submitted: {new Date(o.createdAt).toLocaleString()}
                    <br />
                    Total: ₹{total}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* 🧾 Offer Details Modal */}
      {showDetails && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Offer Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowDetails(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Listing:</strong>{" "}
                  {showDetails.listing?.cropName || "—"}
                </p>
                <p>
                  <strong>Farmer:</strong>{" "}
                  {showDetails.listing?.farmer?.name || "—"}
                </p>
                <p>
                  <strong>Farmer phone:</strong>{" "}
                  {showDetails.listing?.farmer?.phone || "—"}
                </p>
                <p>
                  <strong>Your offered price:</strong> ₹
                  {showDetails.offeredPrice}/kg
                </p>
                <p>
                  <strong>Quantity:</strong> {showDetails.quantity} kg
                </p>
                {showDetails.counterOfferPrice && (
                  <p>
                    <strong>
                      {showDetails.lastActionBy === "buyer"
                        ? "Your counter offer:"
                        : "Farmer's counter:"}
                    </strong>{" "}
                    ₹{showDetails.counterOfferPrice}/kg
                  </p>
                )}
                <p>
                  <strong>Message / Notes:</strong>{" "}
                  {showDetails.notes || showDetails.message || "—"}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowDetails(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
