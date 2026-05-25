const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")

const landingPage = (req, res) => {
  // res.send("<h1>I am here now!!!!</h1>")
  console.log(__dirname);
  // res.sendFile(`${__dirname}/index.html`)
  res.render("index", { name: "Ifeoluwa", gender: "female" });
  // res.sendFile("C:\Users\peter\Desktop\All Coding Classes\Level 3 February class\first-backend\index.html")
};

const registerUser = (req, res) => {
  //   allStudents.push(req.body);

  let form = new userModel(req.body);

  form
    .save()
    .then(() => {
      console.log("User info saved");
      // res.redirect("dashboard");
      res.send({ message: "User registered Successfully", status: true });
    })
    .catch((error) => {
      console.log(error);
      res.send({ message: "Unable to register user", status: false });
    });
  // res.send("User registered")
};

const userDashboard = (req, res) => {
  userModel
    .find()
    .then((user) => {
      console.log(user);
      res.render("dashboard", { customer: user });
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteUser = (req, res) => {
  console.log(req.params.id);

  const customerId = req.params.id;

  userModel
    .findByIdAndDelete(customerId)
    .then(() => {
      console.log("user deleted");
      res.redirect("/dashboard");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error deleting user");
    });
};

const authenticateUser = (req, res) => {
  console.log(req.body);
  let password = req.body.password;
  userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        // email is valid
        console.log(user);
        user.validatePassword(password, (err, same) => {
          if (err) {
            console.log(err);
            return res.send({
              message: "Error validating password",
              status: false,
            });
          }
          if (!same) {
            console.log("Wrong Password");
            res.send({ message: "Wrong Credentials", status: false });
          } else {
            let token = jwt.sign({email:req.body.email}, "secret", {expiresIn:"1h"})
            console.log(token)
            res.send({ message: "Right Details", status: true, token});
            
          }
        });
      } else {
        res.send({ message: "Invalid credentials", status: false });
      }
    })
    .catch((error) => {
      console.log(error);
      res.send({ message: "User not Sign in", status: false });
    });
};

const getDashboard = (req, res)=>{
  let token = req.headers.authorization.split(" ")[1]
  // console.log(token)
  jwt.verify(token, "secret", (err,result)=>{
    if(err){
      console.log(err)
      res.send({message: "Invalid or expired token", status: false})
    }
    else{
      console.log(result)
      res.send({message: "Token is Valid", status: true})
    }
  })
}

module.exports = {
  registerUser,
  userDashboard,
  deleteUser,
  landingPage,
  authenticateUser,
  getDashboard
};
