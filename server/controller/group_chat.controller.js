import sql from "../db/postgres.js";

export const createGroupChatRoom = async (req ,res) => {
  try {
    const {id} = req.params;    
    
    const {room_name} = req.body;
    
    if(!room_name){
        return res
        .status(400)
        .json({message: "Room Name must be provided"});
    }

   const ends_at = Date.now() + (2 * 3600 * 1000);

   const chat_room = await sql`
    INSERT INTO group_chat_room(room_name, owner_id, ends_at)
    VALUES (${room_name},${id}, ${ends_at})
    RETURNING *
  `;

    await sql`
    INSERT INTO group_chat_members(chat_room_id, user_id)
    VALUES (${chat_room[0].id}, ${id})
    RETURNING *
  `;

  return res
  .status(201)
  .json({
    room_id: chat_room[0].id,
    message: "Chat room created successfully"
  });
  } catch (error) {
    return res
    .status(500)
    .json({message: "Something went wrong"})
  };
}

export const joinGroupChatRoom = async (req, res) => {
  try {
    const { id, roomId } = req.params;

    const room = await sql`
      SELECT id, ends_at
      FROM group_chat_room
      WHERE id = ${roomId}
    `;

    if (room.length === 0) {
      return res
        .status(404)
        .json({ message: "Chat room not found" });
    }

    if (room.ends_at < Date.now()) {
      return res
        .status(410)
        .json({ message: "Chat room has expired" });
    }

    const existingMember = await sql`
      SELECT 1
      FROM group_chat_members
      WHERE chat_room_id = ${roomId}
      AND user_id = ${id}
    `;

    if (existingMember.length > 0) {
      return res
        .status(409)
        .json({ message: "User already a member of this room" });
    }

    await sql`
      INSERT INTO group_chat_members(chat_room_id, user_id)
      VALUES (${roomId}, ${id})
    `;

    return res
      .status(200)
      .json({ message: "Joined chat room successfully" });

  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong" });
  }
};

export const leaveGroupChatRoom = async (req, res) => {
  try {
    const { id, roomId } = req.params;

    const membership = await sql`
      SELECT g.owner_id
      FROM group_chat_members m
      JOIN group_chat_room g
      ON g.id = m.chat_room_id
      WHERE m.chat_room_id = ${roomId}
      AND m.user_id = ${id}
    `;

    if (membership.length === 0) {
      return res
        .status(404)
        .json({ message: "User is not a member of this room" });
    }

    if (membership[0].owner_id === id) {
      return res
        .status(403)
        .json({ message: "Room owner cannot leave the group" });
    }

    await sql`
      DELETE FROM group_chat_members
      WHERE chat_room_id = ${roomId}
      AND user_id = ${id}
    `;

    return res
      .status(200)
      .json({ message: "Left chat room successfully" });

  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong" });
  }
};