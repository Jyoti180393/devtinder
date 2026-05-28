// bypass your computer's default internet provider (ISP) router settings
// and talk directly to Cloudflare's public DNS servers
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const connectDb = require("./config/database");

const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Jyoti",
    lastName: "Pokharia",
    email: "Jyoti@gmail.com",
    password: "Jyoti@123",
    age: 30,
    gender: "Female",
  };

  const user = new User(userObj);

  try {
    // Creating new instance of User model and saving user to db
    await user.save();
    // returns a promise so must use async/await

    res.send("Added user successfully");
  } catch (err) {
    // console.error(err);
    res.status(400).send("Error while adding");
  }
});

// connecting to db and then listening to server
connectDb()
  .then(() => {
    console.log("NamasteDB cluster connected");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error(err);
  });
