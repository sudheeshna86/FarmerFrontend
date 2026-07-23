import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";

export default function Messages() {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold fs-3 mb-1">Messages</h1>
          <p className="text-muted">Chat with counterparties from offers and orders.</p>
        </div>
        <button className="btn btn-success" onClick={() => navigate("/chat")}>
          <MessageSquare size={18} className="me-2" />Open Chat
        </button>
      </div>

      <div className="card shadow-sm border-0 p-4 text-center">
        <MessageSquare size={48} className="text-success mb-3 mx-auto" />
        <h5 className="fw-semibold">Your conversations live here</h5>
        <p className="text-muted">Use the chat page to start a conversation, or open it directly from an offer or order.</p>
      </div>
    </div>
  );
}
