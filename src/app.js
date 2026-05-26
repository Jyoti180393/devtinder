const express = require("express");

// creating a server with express instance

const app = express();

// now all the http methods are available on the app instance
// to handle the request on different routes
// app.use("/user", (req, res) => {
//   res.send("Hello from the .use /user route!");
// });

app.get("/user", (req, res) => {
  res.send("Hello from the .get /user route!");
});

app.post("/user", (req, res) => {
  res.send("Hello from the .post /user route!");
});

app.delete("/user", (req, res) => {
  res.send("Hello from the .delete /user route!");
});

/*
app.use("/hello/2", (req, res) => {
  res.send("Hello from the /hello/2 route!");
});

// if the request is before above route, it will be executed
// and will not reach the above route
app.use("/hello", (req, res) => {
  res.send("Hello from the /hello route!");
});

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
*/

// request listener to listen to the request on port 7777
app.listen(7777, () => {
  // callback function to run when the server starts
  console.log("Server is running on port 7777");
});
