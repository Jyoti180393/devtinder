const express = require("express");

const router = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const SAFE_USER_POPULATE_DATA =
  "firstName lastName age gender skills about photoUrl";

// get all the pending request of loggedIn user
router.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested", // only to get pending request
    }).populate("fromUserId", SAFE_USER_POPULATE_DATA);

    res.json({
      message: "Connection Requests fetched",
      data: connectionRequest,
    });
  } catch (err) {
    throw new Error("ERROR: " + err.message);
  }
});

// find the connections which has accepted request of user or user has accepted their request
router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_POPULATE_DATA)
      .populate("toUserId", SAFE_USER_POPULATE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.send({ data });
  } catch (err) {
    throw new Error("ERROR: " + err.message);
  }
});

module.exports = router;
