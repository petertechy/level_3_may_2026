const express = require("express");
const app = express();
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
require("dotenv").config()
const PORT = process.env.PORT;
const userRoute = require("./routes/user.route")
const cors = require("cors")
//body parser
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.set("view engine", "ejs");
app.use("/", userRoute)
// app.listen(port,callback)

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Database yaf connect");
  })
  .catch((error) => {
    console.log("Database yaf refuse to connect");
    console.log(error);
  });

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is running on port " + PORT);
  }
});