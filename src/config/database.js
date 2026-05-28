const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://namaste_db_jp:hello_db@cluster0.9vtpiyo.mongodb.net/devTinder",
  );
};

module.exports = connectDb;
