const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { signUpValidation } = require("../utils/validations");

const User = require("../models/user");
const validator = require("validator");

// signup api
router.post("/signup", async (req, res) => {
  try {
    // Validate the data
    signUpValidation(req);

    // extracted required fields from req.body
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      securityQuestion,
      securityAnswer,
    } = req.body;

    // encrypt the password
    const encryptPwd = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptPwd,
      age,
      gender,
      securityQuestion,
      securityAnswer,
    });

    // creating a new document ->  in User collection -> devTinder DB
    await user.save();
    res.send("Added user successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

// login api
router.post("/login", async (req, res) => {
  // validating the email
  const { email, password } = req.body;

  try {
    // validate email format
    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) throw new Error("Email is not valid");

    // check if email is present in User collection
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send("Invalid credentials");
      // if we are not trowing error we should return from here
      //  to avoid executing the rest of the code
    }

    const isPasswordCorrect = await user.validateEnteredPassword(password);

    if (isPasswordCorrect) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000),
      });
      // cookies will expire in 1 hour

      res.json({ message: "Login Success " + user.firstName, data: user });
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    throw new Error("ERROR: " + err.message);
  }
});

//logout
router.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout successfully");
  // clearing the token cookie by setting it to null and expiring it immediately
  // chaining the cookie method with send method to send the response
  //  after clearing the cookie
});

module.exports = router;
