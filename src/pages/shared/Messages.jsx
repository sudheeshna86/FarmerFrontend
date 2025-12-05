import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState("");

  const conversations = [
    {
      id: "1",
      name: "Green Valley Farms",
      avatar: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=100",
      lastMessage: "The tomatoes will be ready for pickup tomorrow morning",
      time: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Fresh Market Co.",
      avatar: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=100",
      lastMessage: "Can we increase the quantity to 200 kg?",
      time: "1h ago",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      name: "Community Food Bank",
      avatar: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=100",
      lastMessage: "Thank you for the donation! Pickup confirmed",
      time: "3h ago",
      unread: 0,
      online: true,
    },
    {
      id: "4",
      name: "Sunrise Agriculture",
      avatar: "https://images.pexels.com/photos/2894651/pexels-photo-2894651.jpeg?auto=compress&cs=tinysrgb&w=100",
      lastMessage: "Looking forward to our next order",
      time: "1d ago",
      unread: 1,
      online: false,
    },
  ];

  const messages = [
    { id: "1", sender: "them", text: "Hi, I saw your listing for organic tomatoes. Are they still available?", time: "10:30 AM" },
    { id: "2", sender: "me", text: "Yes, they are! We have 150 kg available. When would you like to pick them up?", time: "10:32 AM" },
    { id: "3", sender: "them", text: "Great! Can we schedule for tomorrow morning around 9 AM?", time: "10:35 AM" },
    { id: "4", sender: "me", text: "Perfect! Tomorrow at 9 AM works well. I will have everything ready.", time: "10:37 AM" },
    { id: "5", sender: "them", text: "The tomatoes will be ready for pickup tomorrow morning", time: "10:40 AM" },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold fs-3 mb-1">Inbox</h1>
        <p className="text-muted">Communicate with farmers, buyers, and organizations</p>
      </div>

      <div className="row" style={{ height: "calc(100vh - 200px)" }}>
        {/* Sidebar */}
        <div className="col-lg-4 mb-3 mb-lg-0">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-white">
              <div className="position-relative">
                <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="form-control ps-5"
                />
              </div>
            </div>

            <div className="list-group list-group-flush overflow-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`list-group-item list-group-item-action d-flex align-items-start ${
                    selectedChat?.id === conv.id ? "bg-light" : ""
                  }`}
                  onClick={() => setSelectedChat(conv)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="position-relative me-3">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="rounded-circle"
                      width="48"
                      height="48"
                    />
                    {conv.online && (
                      <span
                        className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                        style={{ width: 10, height: 10 }}
                      ></span>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-0 fw-semibold">{conv.name}</h6>
                      <small className="text-muted">{conv.time}</small>
                    </div>
                    <p className="text-muted small mb-1">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="badge bg-danger rounded-pill">{conv.unread}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="col-lg-8">
          <div className="card h-100 shadow-sm d-flex flex-column">
            {selectedChat ? (
              <>
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-2">
                      <img
                        src={selectedChat.avatar}
                        alt={selectedChat.name}
                        className="rounded-circle"
                        width="40"
                        height="40"
                      />
                      {selectedChat.online && (
                        <span
                          className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                          style={{ width: 10, height: 10 }}
                        ></span>
                      )}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-semibold">{selectedChat.name}</h6>
                      <small className="text-muted">
                        {selectedChat.online ? "Online" : "Offline"}
                      </small>
                    </div>
                  </div>
                  <button className="btn btn-light btn-sm">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div
                  className="card-body flex-grow-1 overflow-auto"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`d-flex mb-3 ${
                        message.sender === "me" ? "justify-content-end" : "justify-content-start"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-3 ${
                          message.sender === "me"
                            ? "bg-success text-white"
                            : "bg-white border text-dark"
                        }`}
                        style={{ maxWidth: "70%" }}
                      >
                        <p className="mb-0">{message.text}</p>
                        <small
                          className={`d-block mt-1 text-end ${
                            message.sender === "me" ? "text-light" : "text-muted"
                          }`}
                        >
                          {message.time}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-footer bg-white">
                  <div className="d-flex align-items-center">
                    <button className="btn btn-light me-2">
                      <Paperclip size={18} />
                    </button>
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button className="btn btn-success" onClick={handleSendMessage}>
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-muted">
                <Search size={48} className="mb-3 opacity-50" />
                <p className="fs-5">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
