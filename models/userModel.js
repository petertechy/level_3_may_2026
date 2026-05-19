const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registeredat: { type: String, default: new Date() },
});

let saltRound = 10;

userSchema.pre("save", async function () {
  // prevent rehashing
  if (!this.isModified("password")) {
    return;
  }
  try{
    const hashedPassword = await bcrypt.hash(this.password, saltRound)
    this.password = hashedPassword
  }
  catch(error){
    console.log(error)
    throw error;
  }
});

userSchema.methods.validatePassword = function (password, callback) {
  console.log(password, this.password);

  bcrypt.compare(password, this.password, (err, same) => {
    console.log(same);
    callback(err, same);
  });
};


const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
