const socket = require("socket.io");
const crypto = require("crypto");
// const jwt = require("jsonwebtoken");
// const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  const Chat = require("../models/chat");

  // const getTokenFromCookieHeader = (cookieHeader = "") => {
  //   const tokenCookie = cookieHeader
  //     .split(";")
  //     .map((cookie) => cookie.trim())
  //     .find((cookie) => cookie.startsWith("token="));

  //   if (!tokenCookie) return null;

  //   try {
  //     return decodeURIComponent(tokenCookie.slice("token=".length));
  //   } catch {
  //     return null;
  //   }
  // };

  // io.use(async (socket, next) => {
  //   try {
  //     const token = getTokenFromCookieHeader(socket.handshake.headers.cookie);
  //     if (!token) return next(new Error("Authentication required"));

  //     const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //     const user = await User.findById(_id).select("firstName photoUrl");
  //     if (!user) return next(new Error("Authentication required"));

  //     socket.user = user;
  //     next();
  //   } catch {
  //     next(new Error("Authentication required"));
  //   }
  // });

  const hasAcceptedConnection = async (userId, targetUserId) => {
    const connection = await ConnectionRequest.exists({
      status: "accepted",
      $or: [
        { fromUserId: userId, toUserId: targetUserId },
        { fromUserId: targetUserId, toUserId: userId },
      ],
    });

    return Boolean(connection);
  };

  const rejectChatAction = (socket) => {
    socket.emit("chatError", {
      message: "You can only chat with a connection.",
    });
  };

  const getSecretRoomId = (userId, targetUserId) => {
    return crypto
      .createHash("sha256")
      .update([userId, targetUserId].sort().join("$"))
      .digest("hex");
  };

  io.on("connection", (socket) => {
    socket.on("joinChat", async ({ userId, targetUserId } = {}) => {
      try {
        if (
          !targetUserId ||
          !(await hasAcceptedConnection(userId, targetUserId))
        ) {
          return rejectChatAction(socket);
        }

        const roomId = getSecretRoomId(userId, targetUserId);
        socket.join(roomId);
      } catch (err) {
        console.error("Error joining chat: ", err);
        rejectChatAction(socket);
      }
    });
    socket.on(
      "sendMessage",
      async ({
        firstName,
        userId,
        photoUrl,
        targetUserId,
        text,
        sendAt,
      } = {}) => {
        try {
          s;
          if (
            !targetUserId ||
            typeof text !== "string" ||
            !text.trim() ||
            !(await hasAcceptedConnection(userId, targetUserId))
          ) {
            return rejectChatAction(socket);
          }

          const roomId = getSecretRoomId(userId.toString(), targetUserId);
          socket.join(roomId);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text: text.trim(),
          });

          await chat.save();

          io.to(roomId).emit("receiveMessage", {
            firstName,
            photoUrl,
            text,
            sendAt,
          });
        } catch (err) {
          console.error("Error sending message: ", err);
          rejectChatAction(socket);
        }
      },
    );
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
