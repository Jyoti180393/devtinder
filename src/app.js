const express = require("express");

// creating a server with express instance

const app = express();
// can also create seprtate router handles and use them works same way
// there functions which are execueted before the actual route handler
//  is called are called middlewares
app.use("/user", (req, res, next) => {
  console.log("User route handler 1 is called");
  // res.send("User route handler 1 response");
  next();
});

app.use("/user", (req, res, next) => {
  console.log("User route handler 2 is called");
  res.send("User route handler 2 response");
});

// request listener to listen to the request on port 7777
app.listen(7777, () => {
  // callback function to run when the server starts
  console.log("Server is running on port 7777");
});
