const express = require("express");

// creating a server with express instance

const app = express();

// this is request handler to handle the request on different route
app.use("/test", (req, res) => {
  res.send("Hello from the /test route!");
});

// fallback for all other routes
// have to be defined at the end of all the routes to avoid overriding the other routes
// if defined before the other routes, it will override all the other routes
// and will be executed for all the requests
app.use("/", (req, res) => {
  res.send("Hello from the server!");
});

// request listener to listen to the request on port 7777
app.listen(7777, () => {
  // callback function to run when the server starts
  console.log("Server is running on port 7777");
});
