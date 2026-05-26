const express = require("express");

// creating a server with express instance

const app = express();

// below routes are not valid in Express 5 route strings.
// /x(y)?z" matches "/xz" and "/xyz", but not "/x(y)?z".
// /xy+z matches "/xyz", "/xyyz", "/xyyyz", and so on,
//   but not "/xz" or "/x(y)?z".
// /xy*z matches "/xz", "/xyz", "/xyyz", "/xyyyz", and so on,
//   but not "/x(y)?z" or "/x(y)?z".
// /x(ya)?*z matches "/xz", "/xyz", "/xyaaaaz", and so on,
//   but not "/x(y)?z" or "/x(y)?z".

// app.get("/x(ya)?*z", (req, res) => {
//   res.send("Hello World");
// });

// /.*fly$/ matches any path that ends with "fly", such as "/butterfly", "/dragonfly", and so on,
//  but not "/fly" or "/flying".
app.get(/.*fly$/, (req, res) => {
  res.send("Hello from /*fly");
});

// listening to query parameters in the URL

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send(
    "Query - /user:  " + req.query.userId + " with name " + req.query.name,
  );
});

// listening to dynamic parameters in the URL
app.get("/user/:id/:name", (req, res) => {
  console.log(req.params);
  res.send("Params - /user: " + req.params.name + " with id " + req.params.id);
});

// request listener to listen to the request on port 7777
app.listen(7777, () => {
  // callback function to run when the server starts
  console.log("Server is running on port 7777");
});
