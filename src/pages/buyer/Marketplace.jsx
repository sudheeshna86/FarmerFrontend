import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { getAllListings} from "../../api/BuyerList";
import { makeOffer, buyerCounterOffer } from "../../api/BuyerOffers";

export default function Marketplace() {
  const { t } = useLanguage();
  const [filterOpen, setFilterOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [listings, setListings] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [offeredPrice, setOfferedPrice] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loading, setLoading] = useState(true);

  // 🆕 NEW: Offer Type (Make Offer / Counter Offer)
  const [offerType, setOfferType] = useState("make"); // make | counter
  const [farmerCounterPrice, setFarmerCounterPrice] = useState(""); // shown when countering

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const data = await getAllListings();
        setListings(data || []);
      } catch (error) {
        console.error("❌ Failed to load listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleMakeOffer = (listing) => {
    setSelectedListing(listing);
    setQuantity("");
    setOfferedPrice(listing.pricePerKg || listing.price);
    setDeliveryMethod("pickup");
    setDeliveryDate("");
    setOfferType("make");
    setFarmerCounterPrice(listing.counterOfferPrice || ""); // optional, may come later
    setOfferModalOpen(true);
  };

 

const handleSubmitOffer = async () => {
  if (!quantity || !offeredPrice) {
    alert("Please enter both quantity and price");
    return;
  }

  try {
    //  console.log("🚀 offerType =", offerType);
    if (offerType === "counter") {
  console.log("🛰 Sending Counter Offer:");

  await buyerCounterOffer({
    listingId: selectedListing._id,
    counterOfferPrice: offeredPrice,
    quantity,
  });

  alert("✅ Your counter offer was sent successfully!");
} else {
      // ✅ Buyer making first offer
      const offerData = {
        listingId: selectedListing._id,
        quantity,
        offeredPrice,
      };
      await makeOffer(offerData);
      alert("✅ Offer submitted successfully!");
    }

    setOfferModalOpen(false);
  } catch (error) {
    console.error("❌ Error submitting offer:", error);
    alert(error.response?.data?.message || "Failed to submit offer");
  }
};

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold fs-3 mb-1">
            {t("marketplace.title") || "Marketplace"}
          </h1>
          <p className="text-muted">
            Discover fresh produce directly from farmers
          </p>
        </div>
        <button
          className="btn btn-outline-success d-flex align-items-center gap-2"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <i className="bi bi-funnel"></i>
          {t("marketplace.filters") || "Filters"}
        </button>
      </div>

      {/* Filters Section */}
      {filterOpen && (
        <div className="card p-3 mb-4 shadow-sm">
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search crops..."
              />
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option>All Categories</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
                <option>Pulses</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option>Distance: All</option>
                <option>Within 25 km</option>
                <option>Within 50 km</option>
                <option>Within 100 km</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-center">
              <input type="checkbox" className="form-check-input me-2" />
              <label className="form-check-label">
                {t("marketplace.organic") || "Organic Only"}
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      <div className="row g-4">
        {listings.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p>No listings available right now.</p>
          </div>
        ) : (
          listings.map((listing) => (
            <div className="col-md-6 col-lg-4" key={listing._id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="position-relative">
                  <img
                    src={
                      listing.imageUrl
                        ? listing.imageUrl.startsWith("http")
                          ? listing.imageUrl
                          : `http://localhost:5000${listing.imageUrl}`
                        : "https://via.placeholder.com/400"
                    }
                    className="card-img-top"
                    alt={listing.cropName}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <button
                    className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="bi bi-heart"></i>
                  </button>
                </div>

                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold mb-0">{listing.cropName}</h5>
                      <small className="text-muted">
                        {listing.farmer?.name || "Unknown Farmer"}
                      </small>
                    </div>
                    <div className="text-warning fw-semibold">★ 4.8</div>
                  </div>

                  <div className="mb-3 text-muted small">
                    <div>
                      <i className="bi bi-geo-alt me-1"></i>
                      {listing.location || "Unknown"} 
                    </div>
                    <div>
                      <i className="bi bi-box me-1"></i>
                      {listing.quantity} kg available
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <div>
                      <h5 className="text-success fw-bold mb-0">
                        ₹{listing.pricePerKg}
                      </h5>
                      <small className="text-muted">per kg</small>
                    </div>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleMakeOffer(listing)}
                    >
                      {t("offer.make") || "Make Offer"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Offer Modal */}
      {offerModalOpen && selectedListing && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {t("offer.make") || "Make / Counter Offer"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setOfferModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Offer Type Selection */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Offer Type
                  </label>
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="offerType"
                        value="make"
                        checked={offerType === "make"}
                        onChange={(e) => setOfferType(e.target.value)}
                      />
                      <label className="form-check-label">Make Offer</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="offerType"
                        value="counter"
                        checked={offerType === "counter"}
                        onChange={(e) => setOfferType(e.target.value)}
                      />
                      <label className="form-check-label">Counter Offer</label>
                    </div>
                  </div>
                </div>

                {/* If Counter Offer, show Farmer’s Price */}
                {offerType === "counter" && farmerCounterPrice && (
                  <div className="alert alert-warning py-2 mb-3">
                    <strong>Farmer's Counter Price:</strong>{" "}
                    ₹{farmerCounterPrice}/kg
                  </div>
                )}

                {/* Offer Inputs */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Quantity (kg)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder={`Max: ${selectedListing.quantity}`}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Your Price (₹ per kg)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={offeredPrice}
                      onChange={(e) => setOfferedPrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* Delivery Options */}
                <label className="form-label fw-semibold">Delivery Method</label>
                <div className="d-flex gap-3 mb-3">
                  {["pickup", "delivery"].map((type) => (
                    <div key={type} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="delivery"
                        value={type}
                        checked={deliveryMethod === type}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      />
                      <label className="form-check-label text-capitalize">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Delivery Date */}
                <div className="mb-3">
                  <label className="form-label">Proposed Delivery Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                {/* Total Summary */}
                <div className="p-3 bg-light border rounded mb-3">
                  <small className="text-muted">Estimated Total</small>
                  <h4 className="text-success fw-bold mb-0">
                    ₹
                    {quantity && offeredPrice
                      ? quantity * offeredPrice
                      : 0}
                  </h4>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setOfferModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleSubmitOffer}
                >
                  {offerType === "counter"
                    ? "Submit Counter Offer"
                    : "Submit Offer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
