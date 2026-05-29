import sql from "../db/postgres.js";

export const sendGroupMessage = async (req, res) => {
    const {id, roomId} = req.params;
    const {message} = req.body;

    // Validate user exists
    const user = await sql`
      SELECT id FROM users
      WHERE id = ${id}
    `;
    
    if (user.length === 0) {
        return res
            .status(404)
            .json({message: "User not found"});
    }

    const usernameResult = await sql`
         SELECT username FROM users
         WHERE id = ${id}
    `
    const username = usernameResult[0].username

    if(!message){
        return res
        .status(400)
        .json({message: "Blank message cannot be sent"})
    }

    try {
        const msg = await sql`
        INSERT INTO group_chat_messages(user_id, room_id, message)
        VALUES (${id}, ${roomId}, ${message})
        RETURNING *
    `

    const Message = {
        id: msg[0].id,
        sender: username,
        senderId: id,
        text: message,
        timestamp: msg.created_at,
        roomId: roomId
    }

    req.io.emit('message:received', Message);

    return res
    .status(201)
    .json({message: "Message delivered successfully"})
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({message: "Something went wrong while sending a message"})
    }
}

export const getGroupChatMessages = async (req, res) => {
    const {roomId} = req.params;
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Default to 50 messages
    const offset = (page - 1) * limit;

    const messages = await sql`
        SELECT * FROM group_chat_messages
        WHERE room_id = ${roomId}
        ORDER BY created_at ASC
        LIMIT ${limit} OFFSET ${offset}
    `

    return res
        .status(200)
        .json({
            messages,
            message: "Messages loaded successfully",
            pagination: {
                page,
                limit
            }
        });
}
