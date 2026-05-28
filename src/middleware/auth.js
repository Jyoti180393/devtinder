const adminAuth = (req, res, next) => {
  console.log("Admin authentication middleware is called");
  const isAdmin = req.query.isAdmin === "true"; // Simulating admin check based on query parameter
  console.log("isAdmin:", isAdmin);
  if (!isAdmin) {
    // If the user is not an admin, send a 403 Forbidden response
    res.status(403).send("Access denied. Admins only.");
  } else {
    // If the user is an admin, call the next middleware or route handler
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User authentication middleware is called");
  const isUserAuthenticated = req.params.isAuthenticated === "true"; // Simulating user authentication check based on query parameter
  console.log("isUserAuthenticated:", isUserAuthenticated);
  if (!isUserAuthenticated) {
    // If the user is not authenticated, send a 401 Unauthorized response
    res.status(401).send("Access denied. User not authenticated.");
  } else {
    // If the user is authenticated, call the next middleware or route handler
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};

//  ;
