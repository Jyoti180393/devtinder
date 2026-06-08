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

POST /request/send/intrested/:userId
POST /request/send/ignore/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

## userRouter

GET /user/connection
GET /user/request/recieved
GET /feed - Gets you the profile of other user on the paltform

Status of sendrequest - ignore, intrested, accepeted, rejected
