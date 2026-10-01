const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

// to get the chat history of the logged in user
router.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    const connectionRequest = await ConnectionRequest.find({
      status: "accepted",
      $or: [
        { fromUserId: userId, toUserId: targetUserId },
        { fromUserId: targetUserId, toUserId: userId },
      ],
    });
    if (!connectionRequest || connectionRequest.length === 0) {
      console.log("No connection request found between users");
      return res.status(400).send("No connection request found between users");
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName photoUrl",
    });

    // path tells where to populate and select tells which fields to select from the populated document

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
