const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 25,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email id is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
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
      maxLength: 500,
    },
    photoUrl: {
      type: String,
      default: "https://placehold.net/avatar.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL is not valid");
        }
      },
    },
    securityQuestion: {
      type: String,
      required: true,
      validate(value) {
        if (
          ![
            "What is your pet name?",
            "What is your favourite color?",
            "What is your best friend's name?",
          ].includes(value)
        ) {
          throw new Error("Not a valid security question");
        }
      },
    },
    securityAnswer: {
      type: String,
      required: true,
      maxLength: 100,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  // here this is referring to the user document for which we are generating the token

  const token = await jwt.sign({ _id: user._id }, "keyTO?unlock_Token", {
    expiresIn: 600,
  });
  // token will expire in 60 sec

  return token;
};

// check if the password entered and password in db for the user matches or not

userSchema.methods.validateEnteredPassword = async function (enteredPassword) {
  const user = this;
  console.log(enteredPassword, user.password);
  const isPasswordMatching = await bcrypt.compare(
    enteredPassword,
    user.password,
  );

  // the order of the arguments in compare method is important,
  //  first we have to pass the password entered by the user
  //  and then the hashed password stored in the database
  return isPasswordMatching;
};

module.exports = mongoose.model("User", userSchema);
