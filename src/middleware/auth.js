const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login again; token is not present");
    }
    const tokenData = await jwt.verify(token, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    const { _id } = tokenData;

    // exp from tokenData is in seconds, so we multiply by 1000 to convert it to milliseconds
    // const expiryTime = Number(tokenData.exp) * 1000;
    // console.log("Token expires at:", new Date(expiryTime).toISOString());

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("user not found");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Token has expired. Please login again");
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token. Please login again");
    }
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};

//  ;
