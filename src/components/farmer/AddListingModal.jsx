import { useState, useEffect } from "react";
import { Save, Send, Check, X } from "lucide-react";
import { Modal, Button, Form } from "react-bootstrap";
import { addFarmerListing, updateFarmerListing } from "../../api/Farmerlist";

export default function AddListingModal({ isOpen, onClose, existingData }) {
  const [step, setStep] = useState(1);
  const [imageUrl, setImageUrl] = useState("");

  const [formData, setFormData] = useState({
    cropName: "",
    category: "",
    quantity: "",
    pricePerKg: "",
    description: "",
    photos: [],
  });

  useEffect(() => {
    if (existingData) {
      setFormData({
        cropName: existingData.cropName,
        category: existingData.category,
        quantity: existingData.quantity,
        pricePerKg: existingData.pricePerKg,
        description: existingData.description,
        photos: existingData.imageUrl
          ? [existingData.imageUrl.startsWith("http")
              ? existingData.imageUrl
              : `http://localhost:5000${existingData.imageUrl}`]
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

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, imageUrl.trim()],
    }));
    setImageUrl("");
  };

  const removePhoto = (i) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== i),
    }));
  };

  const getPhotoSrc = (p) => (typeof p === "string" ? p : p.preview);

  const handleSubmit = async () => {
    try {
      if (existingData) {
        await updateFarmerListing(existingData._id, formData);
        alert("Listing updated!");
      } else {
        await addFarmerListing(formData);
        alert("Listing added!");
      }
      onClose();
    } catch (err) {
      alert("Error saving listing");
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{existingData ? "Edit Listing" : "Add Listing"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {/* Steps */}
        <div className="mb-3 d-flex justify-content-between fw-semibold small">
          <span className={step === 1 ? "text-success" : ""}>Crop Info</span>
          <span className={step === 2 ? "text-success" : ""}>Photos</span>
          <span className={step === 3 ? "text-success" : ""}>Review</span>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Crop Name</Form.Label>
              <Form.Control
                value={formData.cropName}
                onChange={(e) =>
                  setFormData({ ...formData, cropName: e.target.value })
                }
              />
            </Form.Group>

            <Form.Label>Category</Form.Label>
            <div className="d-flex flex-wrap gap-3 mb-3">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => setFormData({ ...formData, category: cat.name })}
                  className={`border p-2 rounded text-center ${
                    formData.category === cat.name
                      ? "border-success bg-light"
                      : "border-secondary"
                  }`}
                  style={{ width: "110px", cursor: "pointer" }}
                >
                  <img src={cat.img} width={60} alt="" />
                  <p className="small">{cat.name}</p>
                </div>
              ))}
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Quantity (kg)</Form.Label>
              <Form.Control
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price per kg (₹)</Form.Label>
              <Form.Control
                type="number"
                value={formData.pricePerKg}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerKg: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Upload Photos</Form.Label>
              <Form.Control type="file" multiple onChange={handleFileUpload} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Add via URL</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button onClick={handleAddImageUrl}>Add</Button>
              </div>
            </Form.Group>

            {formData.photos.length > 0 && (
              <div className="d-flex flex-wrap gap-3">
                {formData.photos.map((p, i) => (
                  <div key={i} className="position-relative" style={{ width: 100 }}>
                    <img
                      src={getPhotoSrc(p)}
                      className="rounded border"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <button
                      className="btn btn-light border position-absolute top-0 end-0 p-0 rounded-circle"
                      onClick={() => removePhoto(i)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="p-3 bg-light rounded">
            <p><strong>Crop:</strong> {formData.cropName}</p>
            <p><strong>Category:</strong> {formData.category}</p>
            <p><strong>Quantity:</strong> {formData.quantity}</p>
            <p><strong>Price/kg:</strong> ₹{formData.pricePerKg}</p>
            <p><strong>Description:</strong> {formData.description}</p>

            <strong>Photos:</strong>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {formData.photos.map((p, i) => (
                <img
                  key={i}
                  src={getPhotoSrc(p)}
                  className="rounded border"
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
              ))}
            </div>
          </div>
        )}

      </Modal.Body>

      <Modal.Footer>
        <Button disabled={step === 1} onClick={handlePrev}>
          Previous
        </Button>

        {step < 3 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button variant="success" onClick={handleSubmit}>
            <Send size={16} className="me-2" />
            {existingData ? "Update" : "Publish"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
