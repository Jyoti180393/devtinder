// bypass your computer's default internet provider (ISP) router settings
// and talk directly to Cloudflare's public DNS servers
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const connectDb = require("./config/database");

const app = express();
const User = require("./models/user");

app.use(express.json());
// middleware for all the routes
// converts all the json to js object and add to Api req

// find a user with email with findOne
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  console.log(userEmail);

  try {
    const user = await User.findOne({ email: userEmail });
    // return data as object
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("Found the user " + user);
    }
  } catch (err) {
    res.status(400).send("Soming went wrong");
  }
});

// get all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    // if any key is given it will return the all the documents matching that key
    if (users.length) {
      res.send(users);
    } else {
      res.status(404).send("No user found");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// delele user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    // await User.findByIdAndDelete(userId);
    await User.findOneAndDelete({ _id: userId });

    res.send("User deleted succesfully");
  } catch (err) {
    res.status(400).send("somthing went wrong");
  }
});

// update user by id
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated with id" + user);
  } catch (err) {
    res.status(400).send("somthing went wrong: " + err.message);
  }
});

// update user by email
app.patch("/user", async (req, res) => {
  try {
    const data = await User.findOneAndUpdate(
      { email: req.body.email },
      req.body,
      { lean: true },
    );
    console.log(data);
    res.send("User Updated with email");
  } catch (err) {
    res.status(400).send("somthing went wrong");
  }
});

// signup api (get all the users)
app.post("/signup", async (req, res) => {
  // Creating new instance of User model
  const user = new User(req.body);
  try {
    // and saving user to db
    // creating a new document in User collection in devTinder DB
    await user.save();
    // returns a promise so must use async/await
    res.send("Added user successfully");
  } catch (err) {
    // console.error(err);
    res.status(400).send("Error while adding" + err.message);
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
