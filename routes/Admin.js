const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Import the admin model
const Admin = require("../models/Admin");

// Route to register an admin
router.post("/register", async (req, res) => {
  try {
    // Check if the email is already in use
    const existingAdmin = await Admin.findOne({ email: req.body.email });
    if (existingAdmin) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new admin
    const admin = new Admin({
      email: req.body.email,
      password: hashedPassword,
      role: 1
    });

    // Save the admin to the database
    await admin.save();

    res.status(200).json({ msg: "Admin registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});
// Route to login an admin
router.post("/login", async (req, res) => {
  try {
    // Check if the email exists
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(400).json({ msg: "Email not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    // Create a JSON Web Token
    const payload = {
      admin: {
        id: admin.id
      }
    };
    const options = {};
    const secret = "secret";
    const token = jwt.sign(payload, secret, options);

    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});
// get by id 
router.get('/getbyid/:id', (req, res) => {
  let id = req.params.id;
  Admin.findOne({ _id: id }).then(
      (data) => {
          res.send(data);
      },
      (err) => {
          res.send(err);
      }
  );
})

module.exports = router;
