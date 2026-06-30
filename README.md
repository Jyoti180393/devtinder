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

- install cookie parser and set dummy cookies (token inside it) in res
- create GET / profile API and get the cookie -> token
- install jsonwebtoken
- in /login api after email and pwd validation create jwt and send it to user with cookies
- read the cookies in /profile and get the details of logged in user
- user Auth middleware and add it profile API
- add new post Api /sendConnectionRequest
- set the expiry of jwt token and cookies
- Create userSchema methods to getJWT() and validateEnteredPassword()
- Use the userSchema methods back in respective request handler

- Listed all the API's and grouped them in respective routers
- Create routes folder for managing auth , profile, request router
- Create respective routers and import these router in app.js
- Create post API /logout
- Create patch API / profile/edit, /profile/password/reset and /profile/password/forgot
- Validation for patch data

- Connection request schema add validation to it
- POST /request/send/:status/:toUserId Api with corner cases
- $or and $and for db query and more logical query in mongodb
- schema.validator .pre("save") function
- added index and compound index in db

- POST /request/review/:status/:requestId Api with corner cases and validation
- GET /user/request/recieved API with validation and filters in userRouter
- Created connection between User and ConncetionRequest Collection with ref
- GET /user/connection with validation and populate chain

- GET /feed API explored select $nin $ne $and query operators

- Install cors and whitelist FE url
- updating error and response of /profile/view

- Fix the TokenExpiredError error
- Added validation while saving the edited profile
- Adding toekn in signup for logging in after successfull signup
- fixed validation bug

## Scheduling cron jobs in NodeJs

- Installing node-corn
- Add cronJob file in utils and add code from docs
- Import cornJOb file in app.js
- Learning about cron expression syntax - crontab.guru
- Scheduled a job for sending email to user for all the connection request recieved last day
- install date-fns
- Find all unique email who have got the connection request
- Send email with subject and body
- Explore Queue mechanish to send bulk emails
- Amazon SES Bulk Emails and bee-queue and bull npm packages
