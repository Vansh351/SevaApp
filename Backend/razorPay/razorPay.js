// import Razorpay from "razorpay"
const Razorpay = require("razorpay");

require("dotenv").config();

// ---- razorpay instance----//
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });
  module.exports =instance;