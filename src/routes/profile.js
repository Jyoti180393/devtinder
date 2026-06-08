const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/auth");

//profile
router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user.firstName + " is logged in");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
