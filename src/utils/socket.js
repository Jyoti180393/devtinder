const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, toUserId }) => {
      const roomId = [userId, toUserId].sort().join("_");
      console.log(firstName, " joined chat room: ", roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      ({ firstName, userId, toUserId, text, sendAt }) => {
        const roomId = [userId, toUserId].sort().join("_");
        console.log(firstName, "sends message: ", text);
        io.to(roomId).emit("receiveMessage", {
          firstName,
          userId,
          toUserId,
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
