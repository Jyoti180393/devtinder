const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//sendConnectionRequest
router.post(
  "/sendConnectionRequest/:status/:toUserId",
  userAuth,
  async (req, res) => {
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
      let message;
      if (status === "interested") {
        message = " has sent connection request to ";
      } else if (status === "ignored") {
        message = " has ignored connection request of ";
      }
      res.send(fromUser.firstName + message + toUser.firstName);
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

module.exports = router;
