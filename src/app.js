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
const { userAuth } = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

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

    const isPasswordCorrect = user.validateEnteredPassword(password);

    if (isPasswordCorrect) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000),
      });
      // cookies will expire in 1 hour

      res.send("Hello " + user.firstName);
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    throw new Error("ERROR: " + err.message);
  }
});

//profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user.firstName + " is logged in");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//sendConnectionRequest
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = await req.user;
    res.send("Coonnection request send by: " + user.firstName);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
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
