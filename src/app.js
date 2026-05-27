const express = require("express");

// creating a server with express instance

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("User route handler 1 is called");

    // once the response is sent the control will not be passed to
    // the next handler in the stack and the request will be completed
    // but will give console error if we try to call next after sending the response
    // since the response is already sent and the request is completed
    // so we cannot pass the control to the next handler in the stack
    // res.send("User route handler 1 response");

    // calling next to pass the control to the next handler in the stack
    // depending on the place it called it can be used to perform
    // some pre-processing before the actual request handler is called
    next();
    // if we don't use next() and send no response in the handler then the
    // request will be hanging (requests will come till timeout) and eventually
    //  timeout error will be thrown in the console
  },
  [
    (req, res, next) => {
      next();
      console.log("User route handler 2 is called");
      // this will be last to execute in the stack
      // since next is called before the console log
      // res.send("User route handler 2 response");
    },
    (req, res, next) => {
      console.log("User route handler 3 is called");
      // res.send("User route handler 3 response");
      next();
    },
  ],
  (req, res, next) => {
    console.log("User route handler 4 is called");
    res.send("User route handler 4 response");
    next();
    // if we don't send the response in the last handler in the stack while using next()
    //  then we get the error "Error: Cannot GET /user
  },
);

// request listener to listen to the request on port 7777
app.listen(7777, () => {
  // callback function to run when the server starts
  console.log("Server is running on port 7777");
});
