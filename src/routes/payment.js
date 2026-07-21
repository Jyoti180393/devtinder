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
    console.log("Webhook body received:", req.body);
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = await validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_KEY,
    );

    if (!isWebhookValid) {
      console.log("INvalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    console.log("User saved");

    await user.save();

    // Update the user as premium

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    // return success response to razorpay

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
