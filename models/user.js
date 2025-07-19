import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    match: [
      /^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Username must be 8–20 characters, contain only letters, numbers, dots, or underscores, with no consecutive dots or underscores, and not start or end with a dot or underscore.",
    ],
    unique: true,
    trim: true,
    lowercase: true,
  },
  image: String,
});

const User = models.User || model("User", UserSchema);
export default User;
