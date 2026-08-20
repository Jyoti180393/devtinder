const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connecction", (socket) => {
    socket.on("joinChat", (roomId) => {
      socket.join(roomId);
    });
    socket.on("sendMessage", (data) => {
      io.to(data.roomId).emit("receiveMessage", data);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
