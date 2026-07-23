import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, Send, Search, Plus, Minimize2, Sparkles, Smile, CheckCheck } from "lucide-react";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";

export default function ChatWidget() {
  const {
    isOpen,
    setIsOpen,
    conversations,
    activeConversation,
    activeMessages,
    loadingChats,
    loadingMessages,
    searchTerm,
    setSearchTerm,
    unreadCount,
    filteredConversations,
    openConversation,
    sendMessage,
    isSending,
    typingUsers,
    startTyping,
    stopTyping,
    showNewChat,
    setShowNewChat,
    newChatRole,
    setNewChatRole,
    newChatUsers,
    selectedNewUser,
    setSelectedNewUser,
    createNewChat,
    connected,
    onlineUsers,
  } = useChat();
  const { user } = useAuth();

  const [draft, setDraft] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const endRef = useRef(null);

  const roleOptions = useMemo(() => {
    const roles = ["buyer", "driver", "farmer"];
    return roles.filter((role) => role !== "farmer");
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, isOpen]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await sendMessage(text);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji) => {
    setDraft((current) => `${current}${emoji}`);
    setShowEmojiPicker(false);
  };

  const widget = (
    <>
      <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 2000 }}>
        {!isOpen && (
          <button
            className="btn btn-success rounded-circle shadow-lg"
            style={{ width: 64, height: 64, position: "relative" }}
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle size={28} />
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {isOpen && (
          <div
            className="bg-white shadow-lg rounded-4 border"
            style={{ width: 620, maxWidth: "94vw", height: 740, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}
          >
            <div className="bg-success text-white px-3 py-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-white bg-opacity-25 p-2">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="fw-semibold">AgriConnect Chat</div>
                  <div className="small text-white-50">{connected ? "Online • Ready" : "Connecting..."}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-sm btn-light text-success" onClick={() => setIsOpen(false)}>
                  <Minimize2 size={16} />
                </button>
                <button className="btn btn-sm btn-light text-success" onClick={() => setIsOpen(false)}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
              <div className="border-end" style={{ width: 220, background: "#f7f9fc" }}>
                <div className="p-3 border-bottom bg-white">
                  <button className="btn btn-sm btn-success w-100 rounded-pill" onClick={() => setShowNewChat(true)}>
                    <Plus size={14} className="me-1" /> New chat
                  </button>
                </div>
                <div className="p-3">
                  <div className="position-relative">
                    <Search size={14} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    <input className="form-control form-control-sm ps-4 rounded-pill" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search" />
                  </div>
                </div>
                <div style={{ overflowY: "auto", height: "calc(100% - 140px)" }}>
                  {loadingChats ? (
                    <div className="text-muted small p-3">Loading conversations…</div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="text-muted small p-3">No conversations yet</div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div key={conversation._id} className={`mx-2 p-3 rounded-4 mb-2 ${activeConversation?._id === conversation._id ? "bg-success bg-opacity-10 border border-success-subtle" : "bg-white border"}`} onClick={() => openConversation(conversation)} style={{ cursor: "pointer", transition: "all 0.2s ease" }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex align-items-center gap-2">
                            <div className="position-relative">
                              <div className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, fontSize: 14, fontWeight: 700 }}>
                                {(conversation.otherUser?.name || "U").charAt(0).toUpperCase()}
                              </div>
                              <span className={`position-absolute bottom-0 end-0 rounded-circle border border-white ${onlineUsers[conversation.otherUser?._id] ? "bg-success" : "bg-secondary"}`} style={{ width: 10, height: 10 }} />
                            </div>
                            <div>
                              <div className="fw-semibold small">{conversation.otherUser?.name || "Chat"}</div>
                              <div className="text-muted small">{conversation.otherUser?.role || ""}</div>
                            </div>
                          </div>
                          {conversation.unreadCount > 0 && <span className="badge bg-danger rounded-pill">{conversation.unreadCount}</span>}
                        </div>
                        <div className="text-muted small text-truncate mt-2">{conversation.lastMessage || "Start chatting"}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                {showNewChat ? (
                  <div className="p-4" style={{ background: "#fafbff" }}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Destination Role</label>
                      <select className="form-select form-select-sm rounded-pill" value={newChatRole} onChange={(event) => setNewChatRole(event.target.value)}>
                        <option value="">Select role</option>
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Destination User</label>
                      <select className="form-select form-select-sm rounded-pill" value={selectedNewUser} onChange={(event) => setSelectedNewUser(event.target.value)}>
                        <option value="">Select user</option>
                        {newChatUsers.map((userOption) => (
                          <option key={userOption._id} value={userOption._id}>{userOption.name}</option>
                        ))}
                      </select>
                    </div>
                    <button className="btn btn-success btn-sm w-100 rounded-pill" onClick={createNewChat}>Create conversation</button>
                  </div>
                ) : activeConversation ? (
                  <>
                    <div className="border-bottom px-3 py-3 d-flex align-items-center justify-content-between bg-white">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: 42, height: 42, fontWeight: 700 }}>
                          {(activeConversation.otherUser?.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold">{activeConversation.otherUser?.name || "Conversation"}</div>
                          <div className="small text-muted">{activeConversation.otherUser?.role || ""} • online</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`small ${onlineUsers[activeConversation.otherUser?._id] ? "text-success" : "text-muted"}`}>
                          {onlineUsers[activeConversation.otherUser?._id] ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow-1 p-3 bg-light overflow-auto">
                      {loadingMessages ? (
                        <div className="text-muted small text-center py-3">Loading messages…</div>
                      ) : activeMessages.length === 0 ? (
                        <div className="text-muted small text-center py-3">No messages yet. Start the conversation.</div>
                      ) : (
                        activeMessages.map((message) => {
                          const isMine = message.senderId === user?._id;
                          return (
                            <div key={message._id || message.tempId} className={`d-flex mb-3 ${isMine ? "justify-content-end" : "justify-content-start"}`}>
                              <div className={`px-3 py-2 rounded-4 shadow-sm ${isMine ? "bg-success text-white" : "bg-white border"}`} style={{ maxWidth: "72%" }}>
                                <div style={{ lineHeight: 1.5 }}>{message.message}</div>
                                <div className={`d-flex align-items-center justify-content-end gap-1 mt-2 ${isMine ? "text-white-50" : "text-muted"}`} style={{ fontSize: 11 }}>
                                  <span>{new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                                  {isMine && <CheckCheck size={12} />}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={endRef} />
                    </div>

                    <div className="border-top p-3 bg-white">
                      <div className="position-relative mb-2">
                        <button className="btn btn-light rounded-circle" type="button" onClick={() => setShowEmojiPicker((prev) => !prev)}>
                          <Smile size={16} />
                        </button>
                        {showEmojiPicker && (
                          <div className="position-absolute bottom-100 start-0 mb-2 border rounded-3 bg-white shadow-sm p-2 d-flex gap-2">
                            {['😊', '👍', '❤️', '✨', '👏'].map((emoji) => (
                              <button key={emoji} type="button" className="btn btn-sm btn-light" onClick={() => insertEmoji(emoji)}>
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          className="form-control rounded-pill"
                          placeholder="Type a message..."
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          onKeyDown={handleKeyDown}
                          onFocus={startTyping}
                          onBlur={stopTyping}
                        />
                        <button className="btn btn-success rounded-circle" onClick={handleSend} disabled={isSending || !draft.trim()}>
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted px-4">
                    <MessageCircle size={42} className="mb-3" />
                    <div className="fw-semibold">Select a conversation</div>
                    <div className="small text-center">Pick a contact to begin chatting.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(widget, document.body);
}
