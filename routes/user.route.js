const express = require("express");
const {
  landingPage,
  registerUser,
  userDashboard,
  deleteUser,
  authenticateUser,
} = require("../controllers/user.controller");
const router = express.Router();

const users = [
  {
    firstname: "Caroline",
    lastname: "SQI",
    age: 20,
    email: "caroline@gmail.com",
    gender: "female",
  },
  {
    firstname: "Ayo",
    lastname: "SQI",
    age: 22,
    email: "ayo@gmail.com",
    gender: "male",
  },
  {
    firstname: "Ifeoluwa",
    lastname: "SQI",
    age: 18,
    email: "ifeoluwa@gmail.com",
    gender: "male",
  },
  {
    firstname: "Hikmat",
    lastname: "SQI",
    age: 20,
    email: "hikmat@gmail.com",
    gender: "female",
  },
];
const allStudents = [];

router.get("/", landingPage);
router.post("/register", registerUser);
router.get("/dashboard", userDashboard);
router.post("/delete/:id", deleteUser);
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.get("/student", (req, res) => {
  res.render("user", { students: users });
});
router.get("/users", (req, res) => {
  res.send(users);
});

router.get("/about", (req, res) => {
  res.send("I am on about page");
});

router.get("/contact", (req, res) => {
  res.send("I am active");
});

router.post("/authenticate", authenticateUser);

module.exports = router;
