/* YOUR FULL UPDATED CODE BELOW */
/* NO LINES REMOVED — ONLY NECESSARY ADDITIONS DONE */

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

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await getMyOffers();
      console.log("Fetched Offers:", data);
      setOffers((data || []).filter((o) => o.status !== "accepted"));
    } catch (err) {
      console.error("❌ Failed to fetch buyer offers:", err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptCounter = async (offerId) => {
    if (!window.confirm("Accept the farmer's counter?")) return;
    try {
      setActionLoading(true);
      await acceptCounterOffer(offerId);
      alert("✅ Offer accepted! Order created successfully.");
      await fetchOffers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to accept counter");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectCounter = async (offerId) => {
    if (!window.confirm("Reject the farmer's counter?")) return;
    try {
      setActionLoading(true);
      await rejectCounterOffer(offerId);
      alert("❌ Counter rejected. Listing added back to marketplace.");
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
        <div className="row g-4">
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
                <Card className="p-3 shadow-sm border-0">

                  {/* HEADER */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="mb-1">{listing.cropName || "Listing"}</h5>
                      <small className="text-muted">
                        {farmer.name || "Farmer"}
                      </small>
                  
                      {/* ⭐ DISPLAY ACTUAL FARMER'S PRICE */}
                      {listing.pricePerKg && (
                        <div className="text-muted small mt-1">
                          Actual Price(Farmer):{" "}
                          <h2>{listing.pricePerKg}</h2>
                          <strong>₹{listing.pricePerKg}/kg</strong>
                          
                        </div>
                      )}

                      {/* OFFERED PRICE */}
                    </div>

                    <div className="text-end">
                      <div className="fw-bold text-success">
                        ₹{o.offeredPrice}/kg
                      </div>
                      <small className="text-muted">
                        for {o.quantity} kg
                      </small>
                    </div>
                  </div>

                  {/* LOCATION */}
                  <div className="mb-2 text-muted small">
                    <Package size={14} className="me-1" />{" "}
                    {listing.location || "Location not provided"}
                  </div>

                  {/* STATUS MESSAGES */}
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
                          {o.counterOfferPrice}/kg — waiting for farmer
                        </div>
                      )}
                    </>
                  )}

                  {/* BUTTONS */}
                  <div className="d-flex gap-2 mt-3">
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

                  {/* FOOTER */}
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

      {/* DETAILS MODAL */}
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

                {/* ⭐ ADD FARMER'S ACTUAL PRICE HERE */}
                <p>
                  <strong>Actual Price (Farmer):</strong>{" "}
                  ₹{showDetails.listing?.pricePerKg}/kg
                </p>

                <p>
                  <strong>Your Offer:</strong> ₹
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
