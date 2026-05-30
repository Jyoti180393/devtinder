For tracking the feature and work updates for the project

- Installed express
- Added server on port 7777
- Added listener for root and other routes
- Added nodemon on global level
- Explored the orde of code for routed (fallback route)
- Explored Http methods get, post , delete
- Explored advance routes like ?, +, (), \* and regex
- Explored route params and query

- Multiple route handlers
- Explore the concept of next()
- Explored middlewares

- created auth middleware for /admin and /user
- Insatlled Mongoose
- Connect Database ,added schema and model and data to DB

- Added postAPI - /signup with dynamic data (req.body data )
- Added Get API - /user with findOne({}) with email
- Added Get API - /feed to get all users with find({})
- Added Delete API - /user to delete user with id
- Added Patch API - /user to update documents with id and email

- Explored Schema type
- Added Validation to User Schema requires, default, unique, lowercase, min, minlength etc.
- Created custom validate function
- Added timestamp to User Schema
- Api level validations

- Validate data in Signup API
- Install bcrypt pkg
- Create passwordHash using bcrypt.hash & save the user is excrupted password
- Create login API
- Compare passwords and throw error if email and password are invalid
