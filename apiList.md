# DevTinder APIs

## authRouter

POST /signup
POST /login
POST /logout

## profileRouter

GET / profile/view
PATCH /profile/edit
PATCH /profile/password

## connectionRequestRouter

### senderEnd

POST /request/send/:status/:toUserId

### reciverEnd

POST /request/review/:status/:toUserId

## userRouter

GET /user/connection
GET /user/request/recieved
GET /feed - Gets you the profile of other user on the paltform

Status of sendrequest - ignore, intrested, accepeted, rejected
