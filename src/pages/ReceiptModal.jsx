import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js/dist/html2pdf";
import axios from "axios";
import apiClient from "../api/apiClient";
import { Modal } from "../components/ui/Modal";
import { payForOrder } from "../api/Orders";

export default function ReceiptModal({ isOpen, onClose, data, refresh }) {
  if (!data) return null;

  console.log("🧾 RECEIPT MODAL DATA:", data);

  // ==== Backend flattened fields ====
  const {
    orderId,
    crop,
    quantity,
    pricePerKg,
    farmerId,
    farmerName,
    farmerAddress,
    farmerPhone,
    buyerId,
    buyerName,
    buyerAddress,
    buyerPhone,
    paidAt,
    status, // <-- important: add this in BuyerOrders
  } = data;

  // ========= useStates =========
  const [distance, setDistance] = useState("-");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loading, setLoading] = useState(false);

  // ========= Basic Calculations =========
  const subtotal = quantity * pricePerKg;
  const tax = subtotal * 0.02;
  const platformFee = 4;
  const grandTotal = subtotal + tax + deliveryFee + platformFee;

  /* --------------------------------------------------
     FETCH DELIVERY FEE
  ---------------------------------------------------*/
  useEffect(() => {
    if (!farmerId || !buyerId) return;

    setLoading(true);

    apiClient
      .get(`/orders/delivery-fee`, {
        params: { farmerId, buyerId },
      })
      .then((res) => {
        if (typeof res.data.deliveryFee === "number")
          setDeliveryFee(res.data.deliveryFee);

        if (typeof res.data.distance === "number")
          setDistance(res.data.distance);
      })
      .catch((err) => console.error("Delivery Fee Error:", err))
      .finally(() => setLoading(false));
  }, [farmerId, buyerId]);
  /* --------------------------------------------------
     📌 DOWNLOAD PDF BUTTON
  ---------------------------------------------------*/
  const downloadPDF = () => {
    const button = document.getElementById("download-btn");
    const element = document.getElementById("invoice");

    if (button) button.style.display = "none";

    html2pdf()
      .set({
        margin: 0.5,
        filename: "invoice.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save()
      .then(() => {
        if (button) button.style.display = "block";
      });
  };

  /* --------------------------------------------------
     💳 PAY NOW HANDLER (ONLY FOR pending_payment)
  ---------------------------------------------------*/
  const handlePayNow = async () => {
    if (!window.confirm("Proceed with payment?")) return;

    try {
      console.log("payment entered")
      await payForOrder(orderId);
      alert("Payment Successful!");

      onClose();
      if (refresh) refresh(); // reload UI
    } catch (err) {
      alert("Payment failed");
    }
  };

  /* --------------------------------------------------
     UI
  ---------------------------------------------------*/
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receipt" size="lg">
      <style>{`
        .header {
          background:#084a70;
          color:white;
          padding:12px;
          font-size:20px;
          font-weight:600;
          text-align:center
        }
        th {
          background:#084a70;
          color:white;
        }
      `}</style>

      <div id="invoice" className="p-4">

        {/* TITLE */}
        <div className="header">AgriConnect Marketplace</div>

        {/* SELLER */}
        <div className="mt-3">
          <strong>Seller:</strong> {farmerName} <br />
          <strong>Phone:</strong> {farmerPhone} <br />
          <strong>Address:</strong> {farmerAddress}
        </div>

        {/* ORDER INFO */}
        <div className="mt-3">
          <strong>Order No:</strong> {orderId} <br />
          <strong>Date:</strong> {paidAt ? new Date(paidAt).toLocaleDateString() : "--"} <br />
          <strong>Crop:</strong> {crop}
        </div>

        {/* TABLE */}
        <table className="table table-bordered text-center mt-4">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th>Tax 2%</th>
              <th>Distance</th>
              <th>Delivery Fee</th>
              <th>Platform</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{crop}</td>
              <td>{quantity} kg</td>
              <td>₹{pricePerKg}</td>
              <td>₹{subtotal.toFixed(2)}</td>
              <td>₹{tax.toFixed(2)}</td>
              <td>{distance !== "-" ? `${distance} km` : loading ? "Loading..." : "-"}</td>
              <td>₹{deliveryFee.toFixed(2)}</td>
              <td>₹{platformFee.toFixed(2)}</td>
              <td>₹{grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* BUYER */}
        <div className="mt-3">
          <strong>Buyer:</strong> {buyerName} <br />
          <strong>Phone:</strong> {buyerPhone} <br />
          <strong>Address:</strong> {buyerAddress}
        </div>

        {/* --------------------------------------------------
              IF PENDING PAYMENT → SHOW PAY NOW BUTTON
        --------------------------------------------------- */}
        {status === "pending_payment" && (
          <button
            className="btn btn-success w-100 mt-3"
            onClick={handlePayNow}
          >
            💳 Pay Now
          </button>
        )}

        {/* --------------------------------------------------
              IF PAID OR HIGHER → SHOW DOWNLOAD INVOICE
        --------------------------------------------------- */}
        {status !== "pending_payment" && (
          <button
            id="download-btn"
            className="btn btn-outline-primary w-100 mt-3"
            onClick={downloadPDF}
          >
            📄 Download Invoice
          </button>
        )}

      </div>
    </Modal>
  );
}
