const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();
const instance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmt, membershipDuration } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

router.post("/payment/create-order", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, email } = req.user;

    const order = await instance.orders.create({
      amount: membershipAmt[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName,
        lastName,
        email,
        membershipType,
      },
    });

    // save the order details in the database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    //return order details to the client
    res.json({
      message: "Order created successfully",
      data: { ...savedPayment.toJSON(), key: process.env.RAZORPAY_KEY },
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.post("/payment/webhook", async (req, res) => {
  try {
    const webhookBody = req.body;
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(webhookBody),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_KEY,
    );
    if (!isWebhookValid) {
      return res.status(400).send("Invalid Webhook");
    }

    const paymentDetails = res.body.payload.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = paymentDetails.notes.membershipType;
    // set date as per membership type, for gold
    user.membershipExpiryDate = new Date(
      Date.now() +
        membershipDuration[paymentDetails.notes.membershipType] *
          24 *
          60 *
          60 *
          1000,
    );
    // set expiry date to 30 days from now
    console.log("user.membershipExpiryDate", user.membershipExpiryDate);
    await user.save();

    return res.status(200).send("Webhook recieved successfully ");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
