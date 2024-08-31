
const catchAsyncErrors = require("../middleware/catchAsynError");


const stripe = require("stripe")('sk_test_51Lewq3IIcDCQ7G4Ui1Ei1NfifOMauYSJeE0TehsV78qOGsLxvqGepE7AtDvDYd3wnhJXAdARLOuUZaI0u2ZDB5gd005z8yiDNY');

exports.processPayment = catchAsyncErrors(async (req, res, next) => {

    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        metadata: {
            company: "Aviculture",
        },
    });
    res.status(200)
        .json({ success: true, client_secret: myPayment.client_secret });

});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});