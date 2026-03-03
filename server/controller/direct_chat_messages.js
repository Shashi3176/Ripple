import sql from "../db/postgres.js";

export const sendDirectMessage = async (req, res) => {
    const {id, roomId} = req.params;
    const {message} = req.body;

    const username = await sql`
        SELECT username FROM users
        WHERE id = ${id}
    `

    if(!message){
        return res
        .status(400)
        .json({message: "Blank message cannot be sent"})
    }

    try {
        const msg = await sql`
        INSERT INTO direct_chat_messages(user_id, room_id, message)
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