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

Deployement

- setup AWS instance
- Backend
- install dependencies in devTinder directory
- allow e2cinstance public IP on mongoDB server
- npm install pm2 -g
- pm2 start npm -- start
- pm2 logs, pl2 lsit, pm2 flsuh <name>, pm2 stop <name>, pm2 delete <name>
- creating process with custom name -> pm2 start npm --name "devTinder-BE" -- start
- Enable port :7777 from AWS instance -> security -> security group
- To fix the mismatch domain we have to use nginx proxy-pass
- Get the config from internet "nginx proxy pass /api to 7777 node application"
- Edit the nginx config file -> sudo nano /etc/nginx/sites-available/default
- Chnage the server name to 13.53.124.61
- Then copy paste the below config

# New Node.js API Proxy block

    location /api/ {
        proxy_pass http://localhost:7777/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

- Save the file either by CTL + O the CTL + X or CTL + X the editor will ask: Save modified buffer?
- Restart the nginx -> sudo syatemctl restart nginx
- Edit the base Url in FE application and push code to github and pull from interface cmd
- Then again run the build command and copy code from devtinder/dist file to /var/www/html/
- sudo scp -r dist/\* /var/www/html/

## Seting email ciew AWS SES

- Login to Amazon console
- Go to IAM and create user (user deatils -> Set permissions select -> (Attach policies directly ->
  and in Permissions policies select(AmazonSESFullAccess ))) then Create user
- Select Amazon SES -> view setuppage
- Create identity with domain name , verify by domain name
- Select Verify Domain with "Easy DKIM" and DKIM signing key length as "RSA_1024_BIT" values and Create identity
- Setup DNS records in cloudeflare DNS records which are copied from AWS public DNS (with CNAME)
- Verify any email address with Amazon SES -> Identities
- Install aws-sdk v3
- Go to Amazon SES examples using SDK for JavaScript (v3) -> SendEmail
- Create a SESclient in utils add the code
- Create sesEmail in utils folder add the code
- Add code to send email when request is send
