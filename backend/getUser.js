const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/gigshield").then(async () => {
  const user = await User.findOne();
  if (user) {
    console.log("USER_ID:", user._id.toString());
  } else {
    console.log("No users found");
  }
  mongoose.disconnect();
});
