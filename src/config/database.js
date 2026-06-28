const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI;
  await mongoose.connect(mongoUri);
};

module.exports = connectDb;
