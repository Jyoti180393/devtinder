const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { subDays, startOfYesterday, endOfYesterday } = require("date-fns");
const sendMail = require("../utils/sendEmail");

cron.schedule("0 11 * * *", async () => {
  try {
    const yesterdatDate = subDays(new Date(), 1);
    const yesterdayStart = startOfYesterday();
    const yesterdayEnd = endOfYesterday();

    const yesterdayPendingReq = await ConnectionRequest.find({
      status: "interested",
      createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd },
    })
      .populate("fromUserId", "firstName, email")
      .populate("toUserId", "firstName, email");

    const listOfEmails = [
      ...new Set(yesterdayPendingReq.map((req) => req.toUserId.email)),
    ];
    // console.log(listOfEmails);

    for (const email of listOfEmails) {
      // send email to each mail id
      try {
        const res = await sendMail.run(
          `Update: You have a friend request ${email}`,
          "Login to dev-tinder.com and checkout all the connection request",
        );
      } catch (err) {
        console.log("Send Mail Error" + err);
      }
    }
  } catch (err) {
    console.log("Cron job error" + err);
  }
});
