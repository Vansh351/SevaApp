const mongoose = require("mongoose");
require("dotenv").config();
const dbUrl = process.env.MONGODB_URL;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex:true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(`MongoDB connection error : ${err}`));

module.exports = {
  Campaign: require("./Campaign"),
  Donation: require("./Donation"),
  User: require("./User"),
  Token: require("./Token"),
  Query: require("./Query"),
};
