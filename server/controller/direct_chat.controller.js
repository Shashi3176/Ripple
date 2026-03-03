import sql from '../db/postgres.js';

export const pairDirectChat = async (req, res) => {
  try {
    const {id} = req.params;

    const [user] = await sql`
        SELECT * FROM users
        WHERE id = ${id}
    `;

    if(!user){
        return res
        .status(404)
        .json({message: "User not found"})
    }

    const existingChatId = user.dir_room_id;

    if(existingChatId != null){
        const [existingRoom] = await sql`
            SELECT * FROM direct_chat
            WHERE id = ${existingChatId}
        `;
        
        if(existingRoom){
            const otherUserId = existingRoom.user1 === id ? existingRoom.user2 : existingRoom.user1;
            
            await sql`
                UPDATE users
                SET dir_room_id = ${null}
                WHERE id = ${otherUserId}
            `;
        }
        
        await sql`
            DELETE FROM direct_chat
            WHERE id = ${existingChatId}
        `;
    }

    const [user2] = await sql`
        SELECT * FROM users
        WHERE id != ${id} AND dir_room_id IS NULL
        ORDER BY RANDOM()
        LIMIT 1;
    `   

    if(!user2){
        return res
        .status(200)
        .json({message: "No users available right now"})
    }

    const [room] = await sql`
        INSERT INTO direct_chat(user1, user2)
        VALUES (${id}, ${user2.id})
        RETURNING *
    `

    await sql`
        UPDATE users
        SET dir_room_id = ${room.id}
        WHERE id = ${id}
    `;

    await sql`
        UPDATE users
        SET dir_room_id = ${room.id}
        WHERE id = ${user2.id}
    `;
    
    req.io.emit('direct_room:created', room);

    return res
    .status(200)
    .json({
        roomId: room.id
    })
  } catch (error) {
    console.log(error);
    return res
    .status(500)
    .json({message: "Something went wrong while assigning random user"});
  }
}

export const leaveDirectChat = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await sql`
        SELECT * FROM users
        WHERE id = ${id}
    `;

    if(!user){
        return res
        .status(404)
        .json({message: "User not found"})
    }

    const chatId = user.dir_room_id;

    if(chatId != null){
        const [room] = await sql`
            SELECT * FROM direct_chat
            WHERE id = ${chatId}
        `;
        
        if(room){
            const otherUserId = room.user1 === id ? room.user2 : room.user1;
            
            await sql`
                UPDATE users
                SET dir_room_id = ${null}
                WHERE id = ${otherUserId}
            `;
        }
        
        await sql`
            DELETE FROM direct_chat
            WHERE id = ${chatId}
        `;
    }

    await sql`
        UPDATE users
        SET dir_room_id = ${null}
        WHERE id = ${id}
    `;

    req.io.emit('direct_room:left');

    res.json({ message: "User disconnected" });
  } catch (error) {
    console.log(error);
    return res
    .status(500)
    .json({message: "Something went wrong while leaving chat"});
  }
};