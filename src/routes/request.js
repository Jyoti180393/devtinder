const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//send ConnectionRequest
router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { status, toUserId } = req.params;
    const fromUserId = req.user._id;

    const allowdedStatus = ["ignored", "interested"];

    // check status is valid or nor
    const isvalidStatus = allowdedStatus.includes(status);
    if (!isvalidStatus) throw new Error("Status is not valid");

    // fincd the toUser data
    const toUser = await User.findById(toUserId);
    if (!toUser) throw new Error("User not found");

    // to check if the connection request already exists
    const exsistingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (exsistingRequest)
      return res.status(400).send("Connection request already exists");

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();

    const fromUser = await req.user;
    let responseMessage;
    if (status === "interested") {
      responseMessage = " has sent connection request to ";
    } else if (status === "ignored") {
      responseMessage = " has ignored connection request of ";
    }
    res.json({
      message: fromUser.firstName + responseMessage + toUser.firstName,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//review Connectionrequets
router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Status is not valid");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate("fromUserId", "firstName");

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `You have ${status} connection request from ${data.fromUserId.firstName} `,
        data,
      });
    } catch (err) {
      throw new Error("ERROR: " + err.message);
    }
  },
);

module.exports = router;
