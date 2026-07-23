import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Send, MessageSquare, Search, ArrowLeft } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { createOrGetChat, getChatMessages, getChatUsers, getUserChats, markChatAsRead, sendChatMessage } from "../../api/chat";

export default function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [destinationRole, setDestinationRole] = useState("");
  const [destinationUsers, setDestinationUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const messagesEndRef = useRef(null);

  const roleOptions = useMemo(() => {
    if (!user?.role) return [];
    if (user.role === "farmer") return ["buyer", "driver"];
    if (user.role === "buyer") return ["farmer", "driver"];
    if (user.role === "driver") return ["farmer", "buyer"];
    return [];
  }, [user?.role]);

  useEffect(() => {
    if (!user) return;
    loadChats();
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    socket.on("chat:new-message", ({ message }) => {
      setMessages((prev) => {
        const exists = prev.some((item) => item._id === message._id || (item.tempId && message.tempId && item.tempId === message.tempId));
        return exists ? prev : [...prev, message];
      });
      loadChats();
    });

    socket.on("chat:notification", ({ message }) => {
      loadChats();
      if (message.receiverId === user?._id) {
        setMessages((prev) => {
          const exists = prev.some((item) => item._id === message._id || (item.tempId && message.tempId && item.tempId === message.tempId));
          return exists ? prev : [...prev, message];
        });
      }
    });

    return () => {
      socket.off("chat:new-message");
      socket.off("chat:notification");
    };
  }, [socket, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const initialData = location.state || {};
    if (initialData.destinationRole) {
      setDestinationRole(initialData.destinationRole);
    }
    if (initialData.destinationUser) {
      setSelectedUser(initialData.destinationUser);
    }
  }, [location.state]);

  useEffect(() => {
    if (destinationRole) {
      loadDestinationUsers(destinationRole);
    }
  }, [destinationRole]);

  useEffect(() => {
    if (selectedUser?._id && user?._id) {
      openConversation(selectedUser._id, destinationRole);
    }
  }, [selectedUser, destinationRole, user?._id]);

  const loadChats = async () => {
    try {
      const data = await getUserChats();
      setChats(data || []);
      if (!selectedChatId && data?.[0]?._id) {
        setSelectedChatId(data[0]._id);
        setActiveChat(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDestinationUsers = async (role) => {
    try {
      const data = await getChatUsers(role);
      setDestinationUsers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openConversation = async (participantId, role) => {
    try {
      const { chat } = await createOrGetChat(participantId, role);
      setSelectedChatId(chat._id);
      setActiveChat(chat);
      await markChatAsRead(chat._id);
      const data = await getChatMessages(chat._id);
      setMessages(data || []);
      await loadChats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !selectedChatId || !selectedUser) return;

    const payload = {
      chatId: selectedChatId,
      receiverId: selectedUser._id,
      receiverRole: selectedUser.role,
      message: messageText,
      senderId: user._id,
      senderRole: user.role,
    };

    try {
      if (socket) {
        socket.emit("send_message", payload);
      }
      await sendChatMessage({
        chatId: selectedChatId,
        receiverId: selectedUser._id,
        receiverRole: selectedUser.role,
        message: messageText,
      });
      setMessageText("");
      await loadChats();
    } catch (err) {
      console.error(err);
    }
  };

  const selectChat = async (chat) => {
    const otherUser = chat.otherUser;
    setSelectedChatId(chat._id);
    setActiveChat(chat);
    setSelectedUser(otherUser);
    setDestinationRole(otherUser?.role || "");
    try {
      await markChatAsRead(chat._id);
      const data = await getChatMessages(chat._id);
      setMessages(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="fw-bold text-success mb-1">Chat</h2>
          <p className="text-muted mb-0">Start conversations with buyers, farmers, and drivers.</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} className="me-2" />Back
        </button>
      </div>

      <div className="row g-3" style={{ minHeight: "70vh" }}>
        <div className="col-lg-4">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label small fw-bold">Source User</label>
                <input className="form-control" value={user?.name || ""} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Destination Role</label>
                <select className="form-select" value={destinationRole} onChange={(e) => setDestinationRole(e.target.value)}>
                  <option value="">Select role</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Destination User</label>
                <select
                  className="form-select"
                  value={selectedUser?._id || ""}
                  onChange={(e) => {
                    const selected = destinationUsers.find((u) => u._id === e.target.value);
                    setSelectedUser(selected || null);
                  }}
                >
                  <option value="">Select a user</option>
                  {destinationUsers.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u._id?.slice(-4)})</option>
                  ))}
                </select>
              </div>

              <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                <Search size={14} /> Recent conversations
              </div>

              <div className="overflow-auto" style={{ maxHeight: "300px" }}>
                {loading ? (
                  <div className="text-muted small">Loading conversations...</div>
                ) : chats.length === 0 ? (
                  <div className="text-muted small">No conversations yet.</div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat._id}
                      className={`p-2 rounded mb-2 ${selectedChatId === chat._id ? "bg-success bg-opacity-10" : "bg-light"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => selectChat(chat)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{chat.otherUser?.name || "Conversation"}</strong>
                        {chat.unreadCount > 0 && <span className="badge bg-danger">{chat.unreadCount}</span>}
                      </div>
                      <div className="text-muted small text-truncate">{chat.lastMessage || "Start the conversation"}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm h-100 border-0 d-flex flex-column">
            {activeChat ? (
              <>
                <div className="card-header bg-white border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <MessageSquare size={18} className="text-success" />
                    <div>
                      <div className="fw-bold">{activeChat.otherUser?.name || "Conversation"}</div>
                      <div className="small text-muted">{activeChat.otherUser?.role || ""}</div>
                    </div>
                  </div>
                </div>

                <div className="card-body flex-grow-1 overflow-auto bg-light">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted py-5">No messages yet. Start the conversation.</div>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.senderId === user?._id;
                      return (
                        <div key={msg._id} className={`d-flex mb-3 ${isMine ? "justify-content-end" : "justify-content-start"}`}>
                          <div className={`p-3 rounded-3 ${isMine ? "bg-success text-white" : "bg-white border"}`} style={{ maxWidth: "75%" }}>
                            <div>{msg.message}</div>
                            <div className={`small mt-2 ${isMine ? "text-white-50" : "text-muted"}`}>
                              {new Date(msg.timestamp || Date.now()).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="card-footer bg-white border-top">
                  <div className="d-flex gap-2">
                    <input
                      className="form-control"
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button className="btn btn-success" onClick={handleSend}>
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                <MessageSquare size={48} className="mb-3" />
                <p>Select a conversation to begin messaging.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
