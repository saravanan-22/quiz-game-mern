import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [3, "Username should have at least 3 characters"],
    },
    age: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password should have at least 6 characters"],
    },
    ph: {
      type: Number,
      required: true,
    },
    currentPoints: {
      type: Number,
    },
    previousPoint: {
      type: Number,
    },
    totalPoints: {
      type: Number,
    },
  },
  {
    timestamps: true,
    // Never send the password hash back to the client.
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash the password whenever it is created or changed through save().
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.checkPassword = function checkPassword(plain) {
  return bcrypt.compare(plain, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
