import { useState, useEffect } from "react";
import { MapPin, Save, Send, Check } from "lucide-react";
import { Modal, Button, Form } from "react-bootstrap";
import { addFarmerListing, updateFarmerListing } from "../../api/Farmerlist";

export default function AddListingModal({ isOpen, onClose, existingData }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cropName: "",
    category: "",
    quantity: "",
    pricePerKg: "",
    location: "",
    description: "",
    photos: [],
  });
  const [imageUrl, setImageUrl] = useState("");

  // ✅ Prefill when editing
  useEffect(() => {
    if (existingData) {
      setFormData({
        cropName: existingData.cropName || "",
        category: existingData.category || "",
        quantity: existingData.quantity || "",
        pricePerKg: existingData.pricePerKg || "",
        location: existingData.location || "",
        description: existingData.description || "",
        photos: existingData.imageUrl
          ? [
              existingData.imageUrl.startsWith("http")
                ? existingData.imageUrl
                : `http://localhost:5000${existingData.imageUrl}`,
            ]
          : [],
      });
    }
  }, [existingData]);

  const categories = [
    { name: "Vegetables", img: "https://cdn-icons-png.flaticon.com/512/766/766149.png" },
    { name: "Fruits", img: "https://cdn-icons-png.flaticon.com/512/590/590685.png" },
    { name: "Grains", img: "https://cdn-icons-png.flaticon.com/512/4322/4322172.png" },
    { name: "Pulses", img: "https://cdn-icons-png.flaticon.com/512/4322/4322208.png" },
    { name: "Spices", img: "https://cdn-icons-png.flaticon.com/512/2769/2769339.png" },
  ];

  const handleNext = () => step < 3 && setStep(step + 1);
  const handlePrev = () => step > 1 && setStep(step - 1);

  // ✅ Handle file uploads with previews
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  // ✅ Add manual image URL
  const handleAddImageUrl = () => {
    if (imageUrl.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, imageUrl.trim()],
      }));
      setImageUrl("");
    }
  };

  // ✅ Handle Add or Edit submission
  const handleSubmit = async () => {
    try {
      console.log("📦 Submitting listing:", formData);

      if (existingData) {
        const data = await updateFarmerListing(existingData._id, formData);
        console.log("✅ Listing updated successfully:", data);
        alert("Listing updated successfully!");
      } else {
        const data = await addFarmerListing(formData);
        console.log("✅ Listing added successfully:", data);
        alert("Listing added successfully!");
      }

      onClose();
      setStep(1);
      setFormData({
        cropName: "",
        category: "",
        quantity: "",
        pricePerKg: "",
        location: "",
        description: "",
        photos: [],
      });
    } catch (error) {
      console.error("❌ Error submitting listing:", error);
      alert(error.response?.data?.message || "Failed to save listing");
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {existingData ? "✏️ Edit Listing" : "Add New Listing"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Stepper */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="d-flex align-items-center flex-fill">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                    s === step
                      ? "bg-success text-white"
                      : s < step
                      ? "bg-light text-success border border-success"
                      : "bg-secondary text-white opacity-50"
                  }`}
                  style={{ width: "40px", height: "40px" }}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className="flex-fill border-top mx-2" style={{ borderWidth: "2px" }}></div>
                )}
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between small text-muted fw-semibold">
            <span className={step === 1 ? "text-success" : ""}>Crop Info</span>
            <span className={step === 2 ? "text-success" : ""}>Location & Photos</span>
            <span className={step === 3 ? "text-success" : ""}>Review</span>
          </div>
        </div>

        {/* Step 1: Crop Info */}
        {step === 1 && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Crop Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Organic Tomatoes"
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Category</Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => setFormData({ ...formData, category: cat.name })}
                    className={`p-2 rounded border text-center cursor-pointer ${
                      formData.category === cat.name ? "border-success bg-light" : "border-secondary"
                    }`}
                    style={{
                      width: "110px",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <img src={cat.img} alt={cat.name} style={{ width: "60px", height: "60px" }} />
                    <p className="small mt-2 mb-0">{cat.name}</p>
                    {formData.category === cat.name && (
                      <Check size={20} className="text-success position-absolute top-0 end-0 m-1" />
                    )}
                  </div>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity (in kg)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter total quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price per kg (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price per kg"
                value={formData.pricePerKg}
                onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your crop, quality, or other details"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
          </>
        )}

        {/* Step 2: Location + Photos */}
        {step === 2 && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Pickup Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your farm or pickup address"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex justify-content-center align-items-center bg-light rounded mb-3" style={{ height: "200px" }}>
              <MapPin size={48} className="text-secondary" />
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Upload Photos</Form.Label>
              <div className="border rounded p-3">
                <Form.Control type="file" multiple onChange={handleFileUpload} />
                <div className="text-center text-muted small mt-2">
                  or add image URL below
                </div>
                <div className="d-flex mt-2 gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Paste image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button variant="outline-success" onClick={handleAddImageUrl}>
                    Add
                  </Button>
                </div>
              </div>

              {/* ✅ Fixed Preview Rendering */}
              {formData.photos.length > 0 && (
                <div className="d-flex flex-wrap gap-3 mt-3">
                  {formData.photos.map((photo, i) => {
                    const src =
                      typeof photo === "string"
                        ? photo.startsWith("blob:") || photo.startsWith("http")
                          ? photo
                          : `http://localhost:5000${photo}`
                        : photo.preview;
                    return (
                      <img
                        key={i}
                        src={src}
                        alt={`preview-${i}`}
                        className="rounded border"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    );
                  })}
                </div>
              )}
            </Form.Group>
          </>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="bg-light border rounded p-3 mb-3">
            <h5>Review Listing</h5>
            <ul className="list-unstyled small">
              <li><strong>Crop Name:</strong> {formData.cropName}</li>
              <li><strong>Category:</strong> {formData.category}</li>
              <li><strong>Quantity:</strong> {formData.quantity} kg</li>
              <li><strong>Price per kg:</strong> ₹{formData.pricePerKg}</li>
              <li><strong>Location:</strong> {formData.location}</li>
              <li><strong>Description:</strong> {formData.description}</li>
              <li>
                <strong>Photos:</strong>
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {formData.photos.map((photo, i) => {
                    const src =
                      typeof photo === "string"
                        ? photo.startsWith("blob:") || photo.startsWith("http")
                          ? photo
                          : `http://localhost:5000${photo}`
                        : photo.preview;
                    return (
                      <img
                        key={i}
                        src={src}
                        alt={`review-${i}`}
                        className="rounded border"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                    );
                  })}
                </div>
              </li>
            </ul>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="outline-secondary" disabled={step === 1} onClick={handlePrev}>
          Previous
        </Button>
        <div className="d-flex gap-2">
          <Button variant="outline-success" onClick={onClose}>
            <Save size={16} className="me-2" /> Save Draft
          </Button>
          {step < 3 ? (
            <Button variant="success" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button variant="success" onClick={handleSubmit}>
              <Send size={16} className="me-2" />{" "}
              {existingData ? "Update Listing" : "Publish"}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}
