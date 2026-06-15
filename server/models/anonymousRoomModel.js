const mongoose = require("mongoose");

const anonymousRoomSchema = mongoose.Schema(
  {
    roomName: { type: String, trim: true },
    topic: { type: String, trim: true },
    roomType: {
      type: String,
      enum: ["group", "direct"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "inactive"],
      default: "active",
      index: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    participantCount: { type: Number, default: 0 },
    maxParticipants: { type: Number, default: 50 },
    expiresAt: { type: Date, index: true },
  },
  { timestamps: true }
);


// Compound indexes for common queries
anonymousRoomSchema.index(
  { roomType: 1, status: 1, createdAt: -1 },
  { name: "browse_index" }
);
anonymousRoomSchema.index(
  { status: 1, expiresAt: 1, participantCount: 1 },
  { name: "expiration_cleanup_index" }
);
anonymousRoomSchema.index(
  { status: 1, createdAt: 1 },
  { name: "purge_deletion_index" }
);

const AnonymousRoom = mongoose.model("AnonymousRoom", anonymousRoomSchema);

module.exports = AnonymousRoom;
