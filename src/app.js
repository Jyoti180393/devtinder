// bypass your computer's default internet provider (ISP) router settings
// and talk directly to Cloudflare's public DNS servers
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDb = require("./config/database");
const { signUpValidation } = require("./utils/validations");
const User = require("./models/user");

const app = express();

app.use(express.json());
app.use(cookieParser());
// middleware for all the routes
// converts all the json to js object and add to Api req

// find a user with email with findOne
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  const allowedFields = ["password", "gender", "age", "skills", "about"];
  const isUpadteAllowed = Object.keys(data).every((key) =>
    allowedFields.includes(key),
  );

  try {
    if (!isUpadteAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
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
    res.send("User Updated with email");
  } catch (err) {
    res.status(400).send("somthing went wrong");
  }
});

// signup api (get all the users)
app.post("/signup", async (req, res) => {
  try {
    // Validate the data
    signUpValidation(req);

    // extracted required fields from req.body
    const { firstName, lastName, email, password, age, gender } = req.body;

    // encrypt the password
    const encryptPwd = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptPwd,
      age,
      gender,
    });

    // creating a new document ->  in User collection -> devTinder DB
    await user.save();
    res.send("Added user successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Please login again");
    }

    const tokenData = await jwt.verify(token, "keyTO?unlock_Token");
    const { _id } = tokenData;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// login api
app.post("/login", async (req, res) => {
  // validating the email
  const { email, password } = req.body;

  try {
    // validate email format
    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) res.status(422).send("Email is not valid");

    // check if email is present in User collection
    const user = await User.findOne({ email: email });
    if (!user) res.status(401).send("Invalid credentials");

    // check if the password entered and password in db for the user matches or not
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const token = await jwt.sign({ _id: user._id }, "keyTO?unlock_Token");

      res.cookie("token", token);
      res.send("Login successfully");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    throw new Error("ERROR: " + err.message);
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
