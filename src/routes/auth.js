const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { signUpValidation } = require("../utils/validations");

const User = require("../models/user");
const validator = require("validator");

// signup api (get all the users)
router.post("/signup", async (req, res) => {
  try {
    // Validate the data
    signUpValidation(req);

    // extracted required fields from req.body
    const { firstName, lastName, email, password, age, gender } = req.body;

    // encrypt the password
    const encryptPwd = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptPwd,
      age,
      gender,
    });

    // creating a new document ->  in User collection -> devTinder DB
    await user.save();
    res.send("Added user successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// login api
router.post("/login", async (req, res) => {
  // validating the email
  const { email, password } = req.body;

  try {
    // validate email format
    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) res.status(422).send("Email is not valid");

    // check if email is present in User collection
    const user = await User.findOne({ email: email });
    if (!user) res.status(401).send("Invalid credentials");

    const isPasswordCorrect = user.validateEnteredPassword(password);

    if (isPasswordCorrect) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000),
      });
      // cookies will expire in 1 hour

      res.send("Hello " + user.firstName);
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    throw new Error("ERROR: " + err.message);
  }
});

module.exports = router;
