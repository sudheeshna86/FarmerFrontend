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
    transactionId, // 👈 1. Added transactionId here
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
  // Add this helper function at the top of your file (outside component)
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* --------------------------------------------------
      💳 PAY NOW HANDLER (RAZORPAY INTEGRATED)
  ---------------------------------------------------*/
  const handlePayNow = async () => {
    // 1. Load Script
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Check internet connection.");
      return;
    }

    try {
      // 2. Call Backend to Create Order
      // 👇 WE ARE SENDING 'grandTotal' HERE
      const { data: orderData } = await apiClient.post("/payments/create-order", {
        orderId: orderId,
        amount: grandTotal, // <--- Sending the calculated total
        deliveryFee: deliveryFee // <--- Sending delivery fee to save it too
      });

      if (!orderData.success) {
        alert("Server error creating order");
        return;
      }

      // 3. Open Razorpay Options
      const options = {
        key: orderData.key_id,
        amount: orderData.amount, // Now this will match your grandTotal
        currency: "INR",
        name: "AgriConnect",
        description: `Order #${orderId}`,
        order_id: orderData.id, // This is the Razorpay Order ID

        // HANDLER: This runs ONLY when payment is successful on Razorpay
        handler: async function (response) {
          try {
            // 4. Verify Payment on Backend
            const verifyRes = await apiClient.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId, // Send original Order ID so backend knows what to update
            });

            if (verifyRes.data.success) {
              alert("Payment Successful! ✅");
              onClose(); // Close modal
              if (refresh) refresh(); // Refresh UI to show "paid" status
            } else {
              alert("Payment Verification Failed ❌");
            }
          } catch (error) {
            console.error(error);
            alert("Payment failed during verification.");
          }
        },
        prefill: {
          name: buyerName,    // Auto-fill buyer details
          contact: buyerPhone,
        },
        theme: {
          color: "#084a70",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong initiating payment.");
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
          <strong>Crop:</strong> {crop} <br />
          
          {/* 👈 2. Display Transaction ID (Only if paid) */}
          {status !== "pending_payment" && (
             <>
               <strong>Transaction ID:</strong> <span style={{fontFamily: 'monospace'}}>{transactionId || "N/A"}</span>
             </>
          )}
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