const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");

//sendConnectionRequest
router.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = await req.user;
    res.send("Coonnection request send by: " + user.firstName);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
