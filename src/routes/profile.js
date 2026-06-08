const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middleware/auth");
const { validateUserData } = require("../utils/validations");
const User = require("../models/user");
const validator = require("validator");

// to view the profile
router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user.firstName + " is logged in");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// to edit the profile data
router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValidData = validateUserData(req);
    if (!isValidData) {
      throw new Error("Invalid fields are send");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).every((key) => (loggedInUser[key] = req.body[key]));
    // looping through the request body and updating the logged in user data
    // with the new data sent in the request body

    await loggedInUser.save();
    // before saving it will also validate the data as per the validation
    // rules defined in the user model schema

    res.json({
      message: `${loggedInUser.firstName} you have updated your pofile`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

// to edit the profile password while loggedIn
router.patch("/profile/password/reset", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { updatedPassword } = req.body;

    const isPasswordStrong = validator.isStrongPassword(updatedPassword);
    if (!isPasswordStrong) throw new Error("Password is not strong");

    const encryptPwd = await bcrypt.hash(updatedPassword, 10);
    loggedInUser.password = encryptPwd;

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} you have updated password successfully`,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// to edit the profile forgotten password (not loggedIn)
router.patch("/profile/password/forgot", async (req, res) => {
  try {
    const { email, securityQuestion, securityAnswer, updatedPassword } =
      req.body;

    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) throw new Error("Email is not valid");

    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Email is not registered");

    const isValidUser =
      user.securityQuestion === securityQuestion &&
      user.securityAnswer === securityAnswer.toLowerCase();
    if (!isValidUser) throw new Error("Security Answer is not correct");

    const isPasswordStrong = validator.isStrongPassword(updatedPassword);
    if (!isPasswordStrong) throw new Error("Password is not strong");

    const encryptPwd = await bcrypt.hash(updatedPassword, 10);
    user.password = encryptPwd;

    await user.save();
    res.json({
      message: `${user.firstName} you have updated password successfully`,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
