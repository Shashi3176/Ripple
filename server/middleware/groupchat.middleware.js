import sql from "../db/postgres.js";

export const verifyRoomMember = async (req, res, next) => {
  const {id, roomId} = req.params;

  const ID = Number(id);
  const user = await sql`
    SELECT id FROM users
    WHERE id = ${ID}
    LIMIT 1
    `

    const room = await sql`
    SELECT id FROM group_chat_room
    WHERE id = ${roomId}
    LIMIT 1
    `

    if(!user || !room){
        return res
        .status(400)
        .json({message: "Invalid id or roomId"})
    }

    try {
        const isMember = await sql`
            SELECT id FROM group_chat_members
            WHERE chat_room_id = ${roomId} AND user_id = ${id}
        `

        if(isMember.length === 0){
            return res
            .status(401)
            .json({message: "You are not a member of this room"})
        }

        next();
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({message: "Something went wrong while verifying the room member"})
    }
}