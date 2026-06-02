const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const cloudinary = require("cloudinary").v2;

if (
  !process.env.CLOUD_NAME ||
  !process.env.CLOUD_API_KEY ||
  !process.env.CLOUD_API_SECRET
) {
  console.error(
    "Cloudinary env vars missing. Make sure CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET are defined.",
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

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
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      let firstName = req.body.firstname || "User";
      let mailOptions = {
        from: "petertechy01@gmail.com",
        to: [req.body.email, "tomiwaonifara@gmail.com", "petertechy01@gmail.com"],
        subject: "Welcome to Our Platform",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0b2647 0%, #1b4f72 100%); color: #f4f9ff; padding: 40px; border-radius: 20px; text-align: center;">
            <h1 style="margin-bottom: 10px; font-size: 38px; letter-spacing: 1px;">Welcome, ${firstName}!</h1>
            <p style="margin: 0 auto 30px; max-width: 600px; font-size: 18px; color: #d4e6f1; line-height: 1.6;">Your account has been created successfully and you're now part of our community. We're excited to help you discover new possibilities and grow with us.</p>
            <div style="display: inline-block; background: rgba(255,255,255,0.12); padding: 20px 30px; border-radius: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.18);">
              <h2 style="margin: 0 0 8px; font-size: 24px; color: #ffffff;">Get Started</h2>
              <p style="margin: 0; font-size: 16px; color: #d4e6f1;">Explore your dashboard, personalize your profile, and enjoy a tailored experience designed just for you.</p>
            </div>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      // res.redirect("dashboard");
      res.send({ message: "User registered Successfully", status: true });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({ message: "Unable to register user", status: false });
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
            res.status(404).send({ message: "Wrong Credentials", status: false });
          } else {
            let token = jwt.sign({ email: req.body.email }, "secret", {
              expiresIn: "1h",
            });
            console.log(token);
            res.status(202).send({ message: "Right Details", status: true, token });
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

const getDashboard = (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  // console.log(token)
  jwt.verify(token, "secret", (err, result) => {
    if (err) {
      console.log(err);
      res.send({ message: "Invalid or expired token", status: false });
    } else {
      console.log(result);
      res.send({ message: "Token is Valid", status: true });
    }
  });
};

const uploadFile = (req, res) => {
  const myfile = req.body.myfile;

  if (!myfile) {
    return res
      .status(400)
      .send({ message: "No file data received", status: false });
  }

  if (
    !process.env.CLOUD_NAME ||
    !process.env.CLOUD_API_KEY ||
    !process.env.CLOUD_API_SECRET
  ) {
    return res
      .status(500)
      .send({ message: "Cloudinary configuration missing", status: false });
  }

  cloudinary.uploader.upload(myfile, (err, result) => {
    if (err) {
      console.error("Cloudinary upload error:", err);
      return res
        .status(500)
        .send({ message: "File could not upload", status: false, error: err });
    }

    console.log("Upload result:", result);
    return res.send({
      message: "File uploaded successfully",
      status: true,
      data: result,
    });
  });
};

module.exports = {
  registerUser,
  userDashboard,
  deleteUser,
  landingPage,
  authenticateUser,
  getDashboard,
  uploadFile,
};
