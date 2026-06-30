const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      ref: "User", // create reference to User collection with respect to fromUserId
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  {
    timestamps: true,
  },
);

// to check if to and from user id are not same
connectionRequestSchema.pre("save", async function () {
  const connectionRequest = this;
  // here this points to the connection request document which is being saved
  // if(this.fromUserId.toString() === this.toUserId.toString()) {}
  // or we can also use mongoose method to compare the object ids
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("From and To user id cannot be same");
  }
  // next();
  // must call next() to move to the next middleware or to save the document
  //  if there are no more middlewares
});

// to queries like findById({ fromUserId, toUserId }) we need to put compound index
// on fromUserId and toUserId fields to make the query efficient
// 1 is ascending order, -1 is descending order, here it does not matter which one we choose
connectionRequestSchema.index({
  fromUserId: 1,
  toUserId: 1,
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);

// next () is giving error in mongoose schema.pre
//  TypeError: next is not a function occurs because you are running a newer version of Mongoose (v9.x or modern v8 releases)
//  where the traditional next() callback has been entirely deprecated
