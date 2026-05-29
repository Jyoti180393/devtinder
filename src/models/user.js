const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 25,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 4,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw Error("Not a valid Gender type");
        }
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "Something intresting about yourself",
    },
    photoUrl: {
      type: String,
      deafult: "https://placehold.net/avatar.png",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
