const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const app = express();

// -----ENV Setup----- //
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const routes = require("./routes");


// -----Middleware----- /
app.use(cors());
app.use(bodyParser.json());

// -----Routes----- //
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

app.use("/api/campaign", routes.campaign);
app.use("/api/user", routes.user);
//app.use("/api/donate", routes.payment);
app.use("/api/donation", routes.donation);
app.use("/api/query", routes.query);
app.use("/api/testpay",routes.testPay);

app.get("/api/getkey",(req,res)=>res.status(200).json({key: process.env.RAZORPAY_API_KEY}))
app.get("*", function(req, res) {
  res.send("404 Error");
});

app.listen(PORT, function () {
  console.log("Server running successfully on http://localhost:4000");
});
