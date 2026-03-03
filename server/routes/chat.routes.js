import { Router } from "express";
import { createGroupChatRoom, getActiveRooms, joinGroupChatRoom, leaveGroupChatRoom } from "../controller/group_chat.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getGroupChatMessages, sendGroupMessage } from "../controller/group_chat_messages.js";
import { verifyRoomMember } from "../middleware/groupchat.middleware.js";
import { leaveDirectChat, pairDirectChat } from "../controller/direct_chat.controller.js";
import { sendDirectMessage } from "../controller/direct_chat_messages.js";

const router = Router();

router.post('/creategroupchatroom/:id', verifyJWT,createGroupChatRoom)
router.post('/joingroupchatroom/:id/:roomId', verifyJWT,joinGroupChatRoom)
router.post('/leavegroupchatroom/:id/:roomId', verifyJWT,leaveGroupChatRoom)
router.get('/getgroupchatrooms',verifyJWT, getActiveRooms)

router.post('/:id/:roomId/sendmessage', verifyJWT, verifyRoomMember,sendGroupMessage);
router.get('/:id/:roomId/getmessages', verifyJWT, verifyRoomMember,getGroupChatMessages);

router.post('/pair/:id',verifyJWT, pairDirectChat);
router.post('/leave/:id',verifyJWT, leaveDirectChat);

router.post('/:id/:roomId/sendmessage', verifyJWT, verifyRoomMember,sendDirectMessage);

export default router;