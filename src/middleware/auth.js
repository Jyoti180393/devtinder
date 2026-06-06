const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Please login again token is not valid");
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
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};

//  ;
