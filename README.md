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

## RazorPay Payment Gateway Integration

- Signup for RazorPay and get the API Key and Secret
- Add RazorPay npm package to the project
- Add key and secret in .env file
- Initialized RazorPay instance in razorpay.js file
- Created API and schema for Payment collection
- Created POST /payment/create-order API to create order and send it to FE
- Saved the order details in Payment collection
- Make the API dynamic with userId, membershipType and amount
- Send API key to FE for RazorPay checkout dialog box
- Once the order is created, send the order details to FE and use it in RazorPay checkout dialog box
- Setup razorpay webhook to listen for payment success and failure events
- Set up the Url https://dev-tinder.com/payment/webhook and select payment.events in razorpay dashboard
- Add Secret key in .env file and verify the webhook signature in the webhook API
- Create API /payment/webhook and verify webhook signature
- Get the orderId from the webhook payload and update the Payment collection with payment details
- Update payment status in Payment collection
- Update the User schema with premium, membershipType and membershipExpiryDate
- Update the User collection with premium membership details once the payment is successful
- Deploy the changes to the server and test the payment flow in production
- Add an API: /premium/verify which Fe will call after the payment is successful
- Same Api can be called to check if the user is premium or not

## Chat feature with server.io

- Install server.io library
- Include the http and create a server with the app
- Add a socket file to initilize the socket
- Create a io instance and listen for connection with io.on();
- Add the socket instance to the server and listen for events like 'joinChat', 'sendMessage' and 'disconnect'
- Include the socket instance in the app.js and call the initializeSocket function with the server instance
