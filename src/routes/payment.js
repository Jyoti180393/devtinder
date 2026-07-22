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
    console.log("[Payment Webhook] Received webhook", req.body);
    const webhookSignature = req.get("X-Razorpay-Signature");
    const webhookBody = JSON.stringify(req.body);

    const isWebhookValid = validateWebhookSignature(
      webhookBody,
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_KEY,
    );

    console.log("[Payment Webhook] Valid Webhook Signature");

    if (!isWebhookValid) {
      console.warn("[Payment Webhook] Invalid signature received");
      return res.status(400).send("Invalid Webhook");
    }

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({
      orderId: paymentDetails.order_id,
    });

    if (!payment) {
      console.log(
        "[Payment Webhook] Payment not found for order",
        paymentDetails.order_id,
      );
      return res.status(404).send("Payment not found");
    }

    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    if (!user) {
      console.log("[Payment Webhook] User not found for payment", payment._id);
      return res.status(404).send("User not found");
    }

    const expiryDate = new Date();
    const monthsToAdd = membershipDuration[paymentDetails.notes.membershipType];
    expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd);

    user.isPremium = true;
    user.membershipType = paymentDetails.notes.membershipType;
    user.membershipExpiryDate = expiryDate;

    console.log(
      "[Payment Webhook] User membership expiry",
      user.membershipExpiryDate.toISOString(),
    );

    await user.save();
    console.log("[Payment Webhook] User data updated successfully", {
      orderId: paymentDetails.order_id,
      status: paymentDetails.status,
      userId: user._id,
    });

    return res.status(200).send("Webhook recieved successfully ");
  } catch (err) {
    console.error("[Payment Webhook] Error processing webhook", err);
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
