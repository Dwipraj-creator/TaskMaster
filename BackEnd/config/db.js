const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting with URI:", process.env.MONGODB_URL_CLOUD);
    await mongoose.connect(process.env.MONGODB_URL_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

module.exports = connectDB;
