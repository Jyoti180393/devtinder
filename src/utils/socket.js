const socket = require("socket.io");
const crypto = require("crypto");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const getSecretRoomId = (userId, targetUserId) => {
    return crypto
      .createHash("sha256")
      .update([userId, targetUserId].sort().join("$"))
      .digest("hex");
  };
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName, " joined chat room: ", roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      ({ firstName, userId, targetUserId, text, sendAt }) => {
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(firstName, "sends message: ", text);
        io.to(roomId).emit("receiveMessage", {
          firstName,
          userId,
          targetUserId,
          text,
          sendAt,
        });
      },
    );
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
