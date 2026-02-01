import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRooms, Room, Member, Message } from '../hooks/useRooms';
import { connectSocket } from '../utilities/connect.socket';

type Props = {
  currentUserId: string;
  currentUserName: string;
};

const formatTime = (ts: string) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatDate = (ts: string) =>
  new Date(ts).toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

const initials = (name: string = "") =>
  name
    .split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

const getAvatarColor = (name: string) => {
  return '#25D366';
};

export const ChatApp: React.FC<Props> = ({
  currentUserId,
  currentUserName,
}) => {
  const {
    rooms,
    messages,
    isLoading,
    error,
    fetchMessages,
    createRoom,
    sendMessage,
    joinRoom,
    leaveRoom,
    sendTypingIndicator,
  } = useRooms(currentUserId);

  connectSocket();
  
  const storedUser = JSON.parse(localStorage.getItem('user')!);
  
  const userId = storedUser[0].id;
  const username = storedUser[0].username;

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});

  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (rooms.length > 0) {
      const firstRoom = rooms[0];
      setSelectedRoom(firstRoom);
      joinRoom(firstRoom.id);
      fetchMessages(userId, firstRoom.id);
    }
    
  }, [rooms, selectedRoom, joinRoom, fetchMessages, userId]);

  // Fetch messages when room changes
  useEffect(() => {
    if (selectedRoom) {
      joinRoom(selectedRoom.id);
      fetchMessages(userId, selectedRoom.id);
    }
  }, [selectedRoom?.id, userId, joinRoom, fetchMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, selectedRoom?.id]);

  // Update selected room when rooms change
  useEffect(() => {
    if (selectedRoom) {
      const updatedRoom = rooms.find((r) => r.id === selectedRoom.id);
      if (updatedRoom) {
        setSelectedRoom(updatedRoom);
      } else {
        // Room was deleted, select another
        setSelectedRoom(rooms[0] || null);
      }
    }
  }, [rooms, selectedRoom]);

  const currentRoomId = selectedRoom?.id ?? '';
  const currentMessages = useMemo(
    () => messages[currentRoomId] ?? [],
    [messages, currentRoomId]
  );

  const filteredRooms = useMemo(() => {
    if (!searchQuery) return rooms;
    return rooms.filter((r) =>
      r.room_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!currentRoomId) return;

    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(currentRoomId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(currentRoomId, false);
    }, 2000);
  }, [isTyping, currentRoomId, sendTypingIndicator]);

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || !selectedRoom || isSending) return;

    setIsSending(true);
    setNewMessage('');

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    sendTypingIndicator(currentRoomId, false);

    try {
      await sendMessage(userId, selectedRoom.id, text, username);
    } catch (err) {
      setNewMessage(text);
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      handleTyping();
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const newRoom = await createRoom(userId, newRoomName.trim());
      setSelectedRoom(newRoom);
      setShowCreateModal(false);
      setNewRoomName('');
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const handleLeaveRoom = async () => {
    if (!selectedRoom) return;

    try {
      await leaveRoom(userId, selectedRoom.id);
      setSelectedRoom(rooms.find((r) => r.id !== selectedRoom.id) || null);
      setShowRoomInfo(false);
    } catch (err) {
      console.error('Failed to leave room:', err);
    }
  };

  const handleRoomSelect = (room: Room) => {
    if (selectedRoom?.id === room.id) return;
    setSelectedRoom(room);
    setShowRoomInfo(false);
  };

  const memberCount = selectedRoom?.members?.length || 0;
  const endsAtDisplay = selectedRoom?.ends_at
    ? new Date(selectedRoom.ends_at).toLocaleString()
    : '';

  const roomTypingUsers = typingUsers[currentRoomId] || [];

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={{ marginTop: 16, color: '#667781' }}>Loading chats...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <p style={{ color: '#e74c3c', marginBottom: 16 }}>{error}</p>
        <button onClick={() => window.location.reload()} style={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <style>
        {`
          * { box-sizing: border-box; }
          input:focus, button:focus { outline: none; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #f1f1f1; }
          ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .room-item:hover { background: #f5f6f6 !important; }
          .message-bubble { animation: fadeIn 0.2s ease-out; }
        `}
      </style>

      {/* Left Sidebar - Room List */}
      <aside style={styles.sidebar}>
        {/* Header */}
        <div style={styles.sidebarHeader}>
          <div style={styles.userInfo}>
            <div style={{ ...styles.userAvatar, background: getAvatarColor(username) }}>
              {initials(username)}
            </div>
            <span style={styles.userName}>{username}</span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={styles.newChatBtn}
            title="Create new room"
          >
            +
          </button>
        </div>

        {/* Search */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Room List */}
        <div style={styles.roomList}>
          {filteredRooms.length === 0 ? (
            <div style={styles.emptyState}>
              {rooms.length === 0 ? (
                <>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                  <p style={{ margin: 0, fontWeight: 500 }}>No rooms yet</p>
                  <p style={{ margin: '8px 0 16px', fontSize: 13, color: '#8696a0' }}>
                    Create a room to start chatting
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    style={styles.emptyStateBtn}
                  >
                    Create Room
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                  <p style={{ margin: 0, color: '#8696a0' }}>No rooms found</p>
                </>
              )}
            </div>
          ) : (
            filteredRooms.map((roomData) => {
              const room = [roomData].flat(Infinity)[0];
              const isActive = selectedRoom?.id === room.id;
              const roomMessages = messages[room.id] || [];
              const lastMessage = roomMessages[roomMessages.length - 1];      
              
              return (
                <div
                  key={room.id}
                  className="room-item" 
                  onClick={() => handleRoomSelect(room)}
                  style={{
                    ...styles.roomItem,
                    background: isActive ? '#e8f5e9' : '#fff',
                    borderLeft: isActive ? '4px solid #25D366' : '4px solid transparent',
                  }}
                >
                  <div style={{ ...styles.roomAvatar, background: getAvatarColor(room.room_name) }}>
                    {room.isGroup ? '👥' : initials(room.room_name)}
                  </div>
                  <div style={styles.roomContent}>
                    <div style={styles.roomHeader}>
                      <span style={styles.roomName}>{room.room_name}</span>
                      {lastMessage && (
                        <span style={styles.roomTime}>{formatTime(lastMessage.timestamp)}</span>
                      )}
                    </div>
                    <div style={styles.roomPreview}>
                      {lastMessage ? (
                        <>
                          {lastMessage.senderId === userId && (
                            <span style={{ color: '#25D366' }}>✓✓ </span>
                          )}
                          <span style={styles.previewSender}>
                            {lastMessage.senderId === userId ? 'You' : lastMessage.sender}:
                          </span>{' '}
                          {lastMessage.text?.length > 35
                            ? lastMessage.text.slice(0, 35) + '...'
                            : lastMessage.text}
                        </>
                      ) : (
                        <span style={{ fontStyle: 'italic' }}>No messages yet</span>
                      )}
                    </div>
                    {room.members && room.members.length > 0 && (
                      <div style={styles.roomMemberCount}>
                        👤 {room.members.length} member{room.members.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main style={{
        ...styles.chatArea,
        width: showRoomInfo ? 'calc(100% - 320px - 280px)' : 'calc(100% - 320px)',
      }}>
        {!selectedRoom ? (
          <div style={styles.noChatSelected}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>💬</div>
            <h2 style={{ margin: '0 0 8px', color: '#41525d' }}>Welcome to Ripple</h2>
            <p style={{ margin: 0, color: '#8696a0' }}>
              Select a room or create a new one to start messaging
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <header style={styles.chatHeader}>
              <div
                style={{ ...styles.chatHeaderAvatar, background: getAvatarColor(selectedRoom.room_name) }}
              >
                {selectedRoom.isGroup ? '👥' : initials(selectedRoom.room_name)}
              </div>
              <div
                style={styles.chatHeaderInfo}
                onClick={() => setShowRoomInfo(!showRoomInfo)}
              >
                <div style={styles.chatHeaderName}>{selectedRoom.room_name}</div>
                <div style={styles.chatHeaderStatus}>
                  {roomTypingUsers.length > 0 ? (
                    <span style={{ color: '#25D366' }}>
                      {roomTypingUsers.join(', ')} typing...
                    </span>
                  ) : (
                    `${memberCount} member${memberCount !== 1 ? 's' : ''}`
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowRoomInfo(!showRoomInfo)}
                style={styles.infoButton}
                title="Room info"
              >
                ℹ️
              </button>
            </header>

            {/* Messages */}
            <div ref={chatBodyRef} style={styles.messagesContainer}>
              {currentMessages.length === 0 ? (
                <div style={styles.noMessages}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
                  <p style={{ margin: 0 }}>No messages yet</p>
                  <p style={{ margin: '8px 0 0', fontSize: 13, color: '#8696a0' }}>
                    Send the first message!
                  </p>
                </div>
              ) : (
                currentMessages.map((msg, index) => {
                  const isMe = msg.senderId === userId;
                  const showSender =
                    !isMe &&
                    (index === 0 || currentMessages[index - 1].senderId !== msg.senderId);
                  const showDate =
                    index === 0 ||
                    new Date(msg.timestamp).toDateString() !==
                      new Date(currentMessages[index - 1].timestamp).toDateString();

                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div style={styles.dateDivider}>
                          <span style={styles.dateLabel}>{formatDate(msg.timestamp)}</span>
                        </div>
                      )}
                      <div
                        className="message-bubble"
                        style={{
                          ...styles.messageRow,
                          justifyContent: isMe ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div style={{ maxWidth: '70%' }}>
                          {showSender && (
                            <div style={{ ...styles.senderName, color: getAvatarColor(msg.sender) }}>
                              {msg.sender}
                            </div>
                          )}
                          <div
                            style={{
                              ...styles.messageBubble,
                              ...(isMe ? styles.myMessage : styles.theirMessage),
                            }}
                          >
                            <div style={styles.messageText}>{msg.text}</div>
                            <div style={styles.messageTime}>
                              {formatTime(msg.timestamp)}
                              {isMe && <span style={{ marginLeft: 4 }}>✓✓</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* Input Area */}
            <div style={styles.inputArea}>
              <button style={styles.attachButton} title="Attach file">
                📎
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                style={styles.messageInput}
                disabled={isSending}
              />
              <button style={styles.emojiButton} title="Emoji">
                😊
              </button>
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || isSending}
                style={{
                  ...styles.sendButton,
                  background: newMessage.trim() && !isSending ? '#25D366' : '#ccc',
                  cursor: newMessage.trim() && !isSending ? 'pointer' : 'not-allowed',
                }}
                title="Send message"
              >
                {isSending ? '⏳' : '➤'}
              </button>
            </div>
          </>
        )}
      </main>

      {/* Right Panel - Room Info */}
      {showRoomInfo && selectedRoom && (
        <aside style={styles.infoPanel}>
          <div style={styles.infoPanelHeader}>
            <button onClick={() => setShowRoomInfo(false)} style={styles.closeButton}>
              ✕
            </button>
            <span style={{ fontWeight: 600 }}>Room Info</span>
          </div>

          <div style={styles.infoPanelContent}>
            <div
              style={{
                ...styles.infoPanelAvatar,
                background: getAvatarColor(selectedRoom.room_name),
              }}
            >
              {selectedRoom.isGroup ? '👥' : initials(selectedRoom.room_name)}
            </div>
            <h3 style={styles.infoPanelName}>{selectedRoom.room_name}</h3>
            <p style={styles.infoPanelSubtext}>
              Created by {selectedRoom.owner_id === userId ? 'you' : 'someone'}
            </p>

            {/* Members Section */}
            <div style={styles.infoSection}>
              <div style={styles.infoSectionTitle}>
                👥 Members ({selectedRoom.members?.length || 0})
              </div>
              <div style={styles.memberList}>
                {selectedRoom.members?.map((member) => (
                  <div key={member.id} style={styles.memberItem}>
                    <div
                      style={{
                        ...styles.memberAvatar,
                        background: getAvatarColor(member.name),
                      }}
                    >
                      {initials(member.name)}
                    </div>
                    <div style={styles.memberDetails}>
                      <span style={styles.memberName}>
                        {member.name}
                        {member.id === userId && ' (You)'}
                      </span>
                      {member.id === selectedRoom.owner_id && (
                        <span style={styles.adminBadge}>Admin</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Details */}
            <div style={styles.infoSection}>
              <div style={styles.infoSectionTitle}>📅 Details</div>
              <div style={styles.infoDetail}>
                <span style={styles.infoLabel}>Expires:</span>
                <span style={styles.infoValue}>{endsAtDisplay}</span>
              </div>
              <div style={styles.infoDetail}>
                <span style={styles.infoLabel}>Room ID:</span>
                <span style={styles.infoValue}>{selectedRoom.id}</span>
              </div>
            </div>

            {/* Leave Room Button */}
            <button onClick={handleLeaveRoom} style={styles.leaveButton}>
              🚪 Leave Room
            </button>
          </div>
        </aside>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div style={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Create New Room</h3>
              <button onClick={() => setShowCreateModal(false)} style={styles.closeButton}>
                ✕
              </button>
            </div>
            <div style={styles.modalBody}>
              <label style={styles.inputLabel}>Room Name</label>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter room name..."
                style={styles.modalInput}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateRoom();
                }}
              />
              <p style={styles.inputHint}>
                Give your room a descriptive name that others can recognize
              </p>
            </div>
            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={!newRoomName.trim()}
                style={{
                  ...styles.createButton,
                  opacity: newRoomName.trim() ? 1 : 0.5,
                  cursor: newRoomName.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  app: {
    display: 'flex',
    height: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#f0f2f5',
    overflow: 'hidden',
  },
  
  // Loading & Error States
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
    background: '#f0f2f5',
  },
  spinner: {
    width: 48,
    height: 48,
    border: '4px solid #e0e0e0',
    borderTopColor: '#25D366',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
    background: '#f0f2f5',
    textAlign: 'center',
  },
  retryBtn: {
    padding: '12px 32px',
    background: '#25D366',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },

  // Sidebar
  sidebar: {
    width: 320,
    minWidth: 320,
    background: '#fff',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '12px 16px',
    background: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e0e0e0',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
  },
  userName: {
    fontWeight: 600,
    fontSize: 15,
    color: '#111',
  },
  newChatBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: 'none',
    background: '#25D366',
    color: '#fff',
    fontSize: 24,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, background 0.2s',
  },
  searchContainer: {
    padding: '8px 12px',
    background: '#f0f2f5',
  },
  searchInput: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    background: '#fff',
    fontSize: 14,
    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
  },
  roomList: {
    flex: 1,
    overflowY: 'auto',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    textAlign: 'center',
    color: '#667781',
  },
  emptyStateBtn: {
    padding: '10px 24px',
    background: '#25D366',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  roomItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    borderBottom: '1px solid #f0f2f5',
  },
  roomAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 600,
    marginRight: 12,
    flexShrink: 0,
  },
  roomContent: {
    flex: 1,
    minWidth: 0,
  },
  roomHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roomName: {
    fontWeight: 600,
    fontSize: 15,
    color: '#111',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  roomTime: {
    fontSize: 11,
    color: '#667781',
    flexShrink: 0,
    marginLeft: 8,
  },
  roomPreview: {
    fontSize: 13,
    color: '#667781',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  previewSender: {
    fontWeight: 500,
  },
  roomMemberCount: {
    fontSize: 11,
    color: '#25D366',
    marginTop: 4,
  },

  // Chat Area
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#efeae2',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    transition: 'width 0.2s',
  },
  noChatSelected: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f2f5',
    textAlign: 'center',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    background: '#f0f2f5',
    borderBottom: '1px solid #e0e0e0',
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
    cursor: 'pointer',
  },
  chatHeaderName: {
    fontWeight: 600,
    fontSize: 16,
    color: '#111',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#667781',
  },
  infoButton: {
    background: 'none',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
    padding: 8,
    borderRadius: '50%',
    transition: 'background 0.2s',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 60px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  noMessages: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#667781',
    textAlign: 'center',
  },
  dateDivider: {
    display: 'flex',
    justifyContent: 'center',
    margin: '16px 0',
  },
  dateLabel: {
    background: '#e1f2fb',
    color: '#54656f',
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500,
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
  },
  messageRow: {
    display: 'flex',
    marginBottom: 2,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 2,
    paddingLeft: 12,
  },
  messageBubble: {
    padding: '8px 12px',
    borderRadius: 8,
    position: 'relative',
    maxWidth: '100%',
    wordBreak: 'break-word',
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
  },
  myMessage: {
    background: '#d9fdd3',
    borderTopRightRadius: 0,
  },
  theirMessage: {
    background: '#fff',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 1.4,
    color: '#111',
    marginRight: 55,
  },
  messageTime: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    fontSize: 11,
    color: '#667781',
    display: 'flex',
    alignItems: 'center',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    background: '#f0f2f5',
    gap: 8,
  },
  attachButton: {
    background: 'none',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    padding: 8,
    color: '#54656f',
  },
  messageInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 8,
    border: 'none',
    fontSize: 14,
    background: '#fff',
  },
  emojiButton: {
    background: 'none',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    padding: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: 'none',
    color: '#fff',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s, transform 0.1s',
  },

  // Info Panel
  infoPanel: {
    width: 280,
    minWidth: 280,
    background: '#fff',
    borderLeft: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
  },
  infoPanelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '16px 20px',
    background: '#f0f2f5',
    borderBottom: '1px solid #e0e0e0',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    color: '#667781',
    padding: 4,
  },
  infoPanelContent: {
    flex: 1,
    overflowY: 'auto',
    padding: 20,
  },
  infoPanelAvatar: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 40,
    margin: '0 auto 16px',
  },
  infoPanelName: {
    textAlign: 'center',
    margin: '0 0 4px',
    fontSize: 18,
  },
  infoPanelSubtext: {
    textAlign: 'center',
    color: '#667781',
    fontSize: 13,
    margin: '0 0 24px',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#25D366',
    marginBottom: 12,
  },
  memberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  memberItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f0f2f5',
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    marginRight: 12,
  },
  memberDetails: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: 500,
  },
  adminBadge: {
    fontSize: 10,
    background: '#25D366',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: 4,
    fontWeight: 500,
  },
  infoDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f0f2f5',
  },
  infoLabel: {
    color: '#667781',
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: 500,
  },
  leaveButton: {
    width: '100%',
    padding: '12px 16px',
    background: '#ffebee',
    border: 'none',
    borderRadius: 8,
    color: '#e53935',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: 16,
    transition: 'background 0.2s',
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: 12,
    width: 400,
    maxWidth: '90%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e0e0e0',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#667781',
    marginBottom: 8,
  },
  modalInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    fontSize: 14,
    transition: 'border-color 0.2s',
  },
  inputHint: {
    fontSize: 12,
    color: '#8696a0',
    marginTop: 8,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    padding: '16px 20px',
    borderTop: '1px solid #e0e0e0',
  },
  cancelButton: {
    padding: '10px 20px',
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  createButton: {
    padding: '10px 24px',
    background: '#25D366',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    transition: 'opacity 0.2s',
  },
};

export default ChatApp;