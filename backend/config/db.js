import mongoose from "mongoose";

const databaseconnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongodb Database connect.!");
  } catch (e) {
    console.log("Database connection failed.!", e);
  }
};

export default databaseconnection;
