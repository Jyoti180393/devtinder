const express = require("express");
// const { adminAuth, userAuth } = require("./middleware/auth");

// creating a server with express instance

const app = express();

app.use("/", (err, req, res, next) => {
  console.error("Error from .use ", err);
  res.status(500).send("Internal Server Error " + err.message);
});
// if the / case is placed at first it will not handle the error
// in the /admin route handler because the / case will be matched
// first and it will not call the next middleware or route handler

app.get("/admin", (req, res) => {
  // can handle the error in the route handler itself
  // with try catch block
  try {
    console.log("Admin route handler use is called");
    throw new Error("New error");

    res.send("Admin route handler get response");
  } catch (error) {
    console.error("Error in admin route handler:", error);
    res.status(500).send("Internal Server Error from route handler");
    // with .status() method we can set the status code of the response
    // and with .send() method we can send the response to the client
  }
});

// should handle the fallback case at last because
// it will match all the routes and if we place it at first
//  then it will not call the next middleware or route handler
app.use("/admin", (err, req, res, next) => {
  console.error("Error from .use ", err);
  res.status(500).send("Internal Server Error " + err.message);
});

// request listener to listen to the request on port 7777
app.listen(7777, () => {
  // callback function to run when the server starts
  console.log("Server is running on port 7777");
});
