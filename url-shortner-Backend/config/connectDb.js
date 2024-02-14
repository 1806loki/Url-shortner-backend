const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/urlShortener");
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error Connecting to Database", error.message);
  }
};

module.exports = connectDb;
