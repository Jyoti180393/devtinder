const socket = require("socket.io");
const crypto = require("crypto");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const Chat = require("../models/chat");

  const getSecretRoomId = (userId, targetUserId) => {
    return crypto
      .createHash("sha256")
      .update([userId, targetUserId].sort().join("$"))
      .digest("hex");
  };
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, photoUrl, targetUserId, text, sendAt }) => {
        // save the chat in the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          // find the chat where all the participants are present

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          // if no chat is found than create a chat as per Chat Schema
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          // save the chat in DB
          await chat.save();

          // emit the message to the room
          io.to(roomId).emit("receiveMessage", {
            firstName,
            photoUrl,
            text,
            sendAt,
          });
        } catch (err) {
          console.error("Error sending message: ", err);
        }
      },
    );
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
