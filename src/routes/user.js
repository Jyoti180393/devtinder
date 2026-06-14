const express = require("express");

const router = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
      message: `${connectionRequest.length} Connection Requests fetched`,
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

    res.send({ message: `${data.length} records found`, data });
  } catch (err) {
    throw new Error("ERROR: " + err.message);
  }
});

// get all the user for logged in User
router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; // must check the limit
    const skip = (page - 1) * limit;
    console.log(page, limit);

    // get all the users which have either send/recieved request from looggedInUser
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser.id }, { toUserId: loggedInUser._id }],
    });
    // .select("fromUserId toUserId")
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    // get all the id's in a SEt
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      (hideUsersFromFeed.add(request.fromUserId.toString()),
        hideUsersFromFeed.add(request.toUserId.toString()));
    });

    // get the users accept the one's whose id are in hideUsersFromFeed
    // also it's own id if the user is new and has not send any request
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, // id should not be of any user in hideUsersFromFeed AND
        { _id: { $ne: loggedInUser._id } }, // id should not be equal to loggedInuser id
      ],
    })
      .select(SAFE_USER_POPULATE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: `${users.length} records found`,
      data: users,
    });
  } catch (err) {
    throw new Error("ERROR: " + err.message);
  }
});

module.exports = router;
