import mongoose from "mongoose";

const uri = "mongodb+srv://kanimozhias00_db_user:kaniAS2007@cluster0.fsdise1.mongodb.net/interviewdb?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("CONNECTED!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });