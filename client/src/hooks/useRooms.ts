import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getSocket } from '../utilities/socket'; 

export type Room = {
  id: string;
  room_name: string;
  owner_id: string;
  ends_at: number;
  members?: Member[];
  isGroup?: boolean;
};

export type Member = {
  id: string;
  name: string;
};

export type Message = {
  id: string;
  sender: string;
  senderId: string;
  text: string;
  timestamp: string;
  roomId: string;
};

const API_BASE = 'http://localhost:3000';

export const useRooms = (currentUserId: string) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_BASE}/groupchat/getgroupchatrooms`, {
          withCredentials: true,
        });
        setRooms(res.data.rooms || []);
        console.log('Initial rooms:', res.data.rooms);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        setError('Failed to load rooms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log('Socket not available');
      return;
    }

    socket.on('room:created', (room: any) => {
      console.log('room:created', room);
      const endsAt = Date.parse(room[0].ends_at); 
      console.log(endsAt);
      console.log(Date.now());
      
      if (Date.now() < endsAt) {
        setRooms((prev) => {
          if (prev.some((r) => r.id === room[0].id)) return prev;
          console.log('Done');
          return [...prev, room];
        });
      }
    });

    socket.on('room:expired', ({ roomId }: { roomId: string }) => {
      console.log('room:expired', roomId);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    });

    socket.on('room:updated', (updatedRoom: Room) => {
      console.log('room:updated', updatedRoom);
      setRooms((prev) =>
        prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
      );
    });

    socket.on('room:deleted', ({ roomId }: { roomId: string }) => {
      console.log('room:deleted', roomId);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    });

    socket.on('room:member:joined', ({ roomId, member }: { roomId: string; member: Member }) => {
      console.log('room:member:joined', roomId, member);
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === roomId) {
            const members = r.members || [];
            if (members.some((m) => m.id === member.id)) return r;
            return { ...r, members: [...members, member] };
          }
          return r;
        })
      );
    });

    socket.on('room:member:left', ({ roomId, memberId }: { roomId: string; memberId: string }) => {
      console.log('room:member:left', roomId, memberId);
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === roomId) {
            return {
              ...r,
              members: (r.members || []).filter((m) => m.id !== memberId),
            };
          }
          return r;
        })
      );
    });

    socket.on('message:received', (message: Message) => {
      console.log('message:received', message);
      setMessages((prev) => ({
        ...prev,
        [message.roomId]: [...(prev[message.roomId] || []), message],
      }));
    });

    socket.on('user:typing', ({ roomId, userId, userName }: { roomId: string; userId: string; userName: string }) => {
      console.log('user:typing', roomId, userId, userName);
    });

    socket.on('user:stopped:typing', ({ roomId, userId }: { roomId: string; userId: string }) => {
      console.log('user:stopped:typing', roomId, userId);
    });

    return () => {
      socket.off('room:created');
      socket.off('room:expired');
      socket.off('room:updated');
      socket.off('room:deleted');
      socket.off('room:member:joined');
      socket.off('room:member:left');
      socket.off('message:received');
      socket.off('message:deleted');
      socket.off('user:online');
      socket.off('user:offline');
      socket.off('user:typing');
      socket.off('user:stopped:typing');
    };
  }, []);

  const updateMemberOnlineStatus = (userId: string, isOnline: boolean) => {
    setRooms((prev) =>
      prev.map((room) => ({
        ...room,
        members: room.members?.map((member) =>
          member.id === userId ? { ...member, isOnline } : member
        ),
      }))
    );
  };

  const fetchMessages = useCallback(async (id: string,roomId: string) => {
    try {
      const res = await axios.get(`${API_BASE}/groupchat/${id}/${roomId}/getmessages`, {
        withCredentials: true,
      });
      setMessages((prev) => ({
        ...prev,
        [roomId]: res.data.messages || [],
      }));
      return res.data.messages;
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      return [];
    }
  }, []);

  const createRoom = useCallback(async (id: string, room_name: string) => {
    try {
      console.log(id);
      const socket = getSocket();
      const res = await axios.post(
        `${API_BASE}/groupchat/creategroupchatroom/${id}`,
        {
          room_name: room_name,
        },
        { withCredentials: true }
      );
      
      const newRoom = res.data.chat_room;
      
      if (socket) {
        socket.emit('room:created', newRoom[0]);
      }
      
      return newRoom[0];
    } catch (err) {
      console.error('Failed to create room:', err);
      throw err;
    }
  }, []);

  const sendMessage = useCallback(async (id: string,roomId: string, text: string, senderName: string) => {
    try {
      const socket = getSocket();
      const message: Message = {
        id: id,
        sender: senderName,
        senderId: currentUserId,
        text,
        timestamp: new Date().toISOString(),
        roomId,
      };

      setMessages((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), message],
      }));

      // Send via socket for real-time delivery
      if (socket) {
        socket.emit('message:send', {
          roomId,
          text,
          senderId: currentUserId,
          senderName,
        });
      }

      await axios.post(
        `${API_BASE}/groupchat/${id}/${roomId}/sendmessage`,
        { room_id: roomId, text },
        { withCredentials: true }
      );

      return message;
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  }, [currentUserId]);

  const joinRoom = useCallback((roomId: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('room:join', { roomId });
    }
  }, []);

  const leaveRoom = useCallback(async (id: string,roomId: string) => {
    try {
      const socket = getSocket();
      
      await axios.post(
        `${API_BASE}/groupchat/leavegroupchatroom/${id}/${roomId}`,
        { room_id: roomId },
        { withCredentials: true }
      );

      if (socket) {
        socket.emit('room:leave', { roomId });
      }

      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch (err) {
      console.error('Failed to leave room:', err);
      throw err;
    }
  }, []);

  const addMember = useCallback(async (roomId: string, memberId: string) => {
    try {
      const socket = getSocket();
      
      const res = await axios.post(
        `${API_BASE}/groupchat/addmember`,
        { room_id: roomId, member_id: memberId },
        { withCredentials: true }
      );

      if (socket) {
        socket.emit('room:member:add', { roomId, memberId });
      }

      return res.data.member;
    } catch (err) {
      console.error('Failed to add member:', err);
      throw err;
    }
  }, []);

  const removeMember = useCallback(async (roomId: string, memberId: string) => {
    try {
      const socket = getSocket();
      
      await axios.post(
        `${API_BASE}/groupchat/removemember`,
        { room_id: roomId, member_id: memberId },
        { withCredentials: true }
      );

      if (socket) {
        socket.emit('room:member:remove', { roomId, memberId });
      }
    } catch (err) {
      console.error('Failed to remove member:', err);
      throw err;
    }
  }, []);

  const sendTypingIndicator = useCallback((roomId: string, isTyping: boolean) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(isTyping ? 'user:typing' : 'user:stopped:typing', {
        roomId,
        userId: currentUserId,
      });
    }
  }, [currentUserId]);

  return {
    rooms,
    messages,
    isLoading,
    error,
    onlineUsers,
    fetchMessages,
    createRoom,
    sendMessage,
    joinRoom,
    leaveRoom,
    addMember,
    removeMember,
    sendTypingIndicator,
    setRooms,
    setMessages,
  };
};