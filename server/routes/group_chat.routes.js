import { Router } from "express";
import { createGroupChatRoom, joinGroupChatRoom, leaveGroupChatRoom } from "../controller/group_chat.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/creategroupchatroom/:id', verifyJWT,createGroupChatRoom)
router.post('/joingroupchatroom/:id/:roomId', verifyJWT,joinGroupChatRoom)
router.post('/leavegroupchatroom/:id/:roomId', verifyJWT,leaveGroupChatRoom)

export default router;