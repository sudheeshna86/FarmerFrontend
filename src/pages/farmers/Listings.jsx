import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, Package, Tag } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import AddListingModal from "../../components/farmer/AddListingModal";
import { getMyListings, deleteFarmerListing } from "../../api/Farmerlist";

export default function Listings() {
  const { t } = useLanguage();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [listings, setListings] = useState([]);
  const [editListing, setEditListing] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch listings on mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await getMyListings();
      console.log("✅ My Listings:", data);
      setListings(data || []);
    } catch (error) {
      console.error("❌ Failed to load listings:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Handle Delete Listing
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteFarmerListing(id);
        alert("Listing deleted successfully!");
        setListings((prev) => prev.filter((l) => l._id !== id));
      } catch (error) {
        console.error("❌ Failed to delete listing:", error);
        alert("Failed to delete listing");
      }
    }
  };

  // ✏️ Handle Edit (open modal pre-filled)
  const handleEdit = (listing) => {
    setEditListing(listing);
    setAddModalOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3 text-muted">Loading your listings...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-2">{t("nav.listings")}</h2>
          <p className="text-muted mb-0">Manage your crop inventory and donations</p>
        </div>
        <button
          className="btn btn-success d-flex align-items-center"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus size={18} className="me-2" /> {t("listing.add")}
        </button>
      </div>

      {/* Listings Grid/List */}
      {listings.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No listings found. Add your first one!</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "row g-4" : "d-flex flex-column gap-3"}>
          {listings.map((listing) => (
            <div
              key={listing._id}
              className={viewMode === "grid" ? "col-12 col-md-6 col-lg-4" : ""}
            >
              <div className="card shadow-sm border-0 h-100">
                <div className={viewMode === "grid" ? "" : "d-flex"}>
                  <div
                    className={
                      viewMode === "grid"
                        ? "position-relative"
                        : "position-relative flex-shrink-0"
                    }
                    style={{
                      height: viewMode === "grid" ? "200px" : "180px",
                      width: viewMode === "grid" ? "100%" : "220px",
                    }}
                  >
                    <img
                      src={
                        listing.imageUrl
                          ? listing.imageUrl.startsWith("http")
                            ? listing.imageUrl
                            : `http://localhost:5000${listing.imageUrl}`
                          : "https://via.placeholder.com/400"
                      }
                      alt={listing.cropName}
                      className="img-fluid w-100 h-100 rounded-top object-fit-cover"
                    />

                    <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                      {listing.category && (
                        <span className="badge bg-info small text-dark">
                          {listing.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-body">
                    <h5 className="fw-bold text-dark">{listing.cropName}</h5>

                    {/* 🟢 Category Display */}
                    {listing.category && (
                      <div className="text-muted small mb-2 d-flex align-items-center">
                        <Tag size={16} className="me-2" />
                        <span className="fw-semibold">{listing.category}</span>
                      </div>
                    )}

                    {/* Crop Details */}
                    <div className="text-muted small mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <Package size={16} className="me-2" />
                        {listing.quantity} kg • ₹{listing.pricePerKg}/kg
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <Calendar size={16} className="me-2" /> Added recently
                      </div>
                    </div>

                    {/* Description Section */}
                    {listing.description && (
                      <p className="text-secondary small mb-3">
                        {listing.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-outline-success btn-sm d-flex align-items-center"
                        onClick={() => handleEdit(listing)}
                      >
                        <Edit size={16} className="me-1" /> Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm d-flex align-items-center"
                        onClick={() => handleDelete(listing._id)}
                      >
                        <Trash2 size={16} className="me-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Listing Modal */}
      {addModalOpen && (
        <AddListingModal
          isOpen={addModalOpen}
          existingData={editListing}
          onClose={() => {
            setAddModalOpen(false);
            setEditListing(null);
            setTimeout(() => fetchListings(), 1000);
          }}
        />
      )}
    </div>
  );
}
