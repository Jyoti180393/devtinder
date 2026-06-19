const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login again token is not valid");
    }
    const tokenData = await jwt.verify(token, "keyTO?unlock_Token", {
      expiresIn: "1h",
    });
    const { _id } = tokenData;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("user not found");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    // Check if token is expired
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Token has expired. Please login again");
    }
    res.status(400).send("ERROR is : " + err.message);
  }
};

module.exports = {
  userAuth,
};

//  ;
