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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);

  // 🟢 Fetch listings on mount and when page changes
  useEffect(() => {
    fetchListings(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchListings = async (requestedPage = page) => {
    try {
      setLoading(true);
      const params = {
        page: requestedPage,
        limit: pageSize,
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const data = await getMyListings(params);
      console.log("✅ My Listings:", data);
      setListings(data.listings || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || requestedPage);
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

      {/* Filters Panel */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label small mb-1">Search</label>
            <input
              type="text"
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by crop, location or category"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small mb-1">Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains</option>
              <option value="Pulses">Pulses</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small mb-1">Min price</label>
            <input
              type="number"
              className="form-control"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="₹0"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small mb-1">Max price</label>
            <input
              type="number"
              className="form-control"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="₹1000"
            />
          </div>
          <div className="col-md-2 d-flex gap-2">
            <button
              className="btn btn-success w-100"
              onClick={() => {
                setPage(1);
                fetchListings(1);
              }}
            >
              Apply
            </button>
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setMinPrice("");
                setMaxPrice("");
                setPage(1);
                fetchListings(1);
              }}
            >
              Reset
            </button>
          </div>
        </div>
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
                        Available quantity:{listing.quantity} kg 
                        Actual quantity:{listing.actualquantity}kg
                         ₹{listing.pricePerKg}/kg
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span className="text-muted">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
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
