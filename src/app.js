const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");

// creating a server with express instance

const app = express();

app.use("/admin", adminAuth);
// this will handle all the requests to the /admin route and its sub-routes
// and will call the adminAuth middleware before handling the request

app.get("/admin/getAdminData", (req, res) => {
  console.log("Admin route handler get is called");
  res.send("Admin route handler get response");
});

app.post("/admin/postAdminData", (req, res) => {
  console.log("Admin route handler post is called");
  res.send("Admin route handler post response");
});

// is only one route handler for the /user route
// then we can directly use the userAuth middleware in the route definition
app.use("/user/:isAuthenticated", userAuth, (req, res) => {
  console.log("User route handler get is called");
  res.send("User route handler get response");
});

// request listener to listen to the request on port 7777
app.listen(7777, () => {
  // callback function to run when the server starts
  console.log("Server is running on port 7777");
});
