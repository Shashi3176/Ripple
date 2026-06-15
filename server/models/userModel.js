const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    // FIX: Kept 'unique: true' (which auto-creates the index) and removed 'index: true'
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    anonymousName: { type: mongoose.Schema.Types.ObjectId, ref: "AnonymousName" },
  },
  { timestamps: true }
);

// Indexes
// FIX: Removed the duplicate email index line from here
userSchema.index({ anonymousName: 1 });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function () {
  // If the password hasn't been modified, just exit the function
  if (!this.isModified("password")) {
    return;
  }

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // No next() call is needed here anymore!
});

// Prevent anonymous name spoofing - ensure name is updated only server-side
userSchema.methods.setAnonymousName = async function(nameId) {
  this.anonymousName = nameId;
  return this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
