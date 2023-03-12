const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Candidate = require('../models/Candidate');
const jwt = require('jsonwebtoken');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'Image') {
      cb(null, './images');
    } else if (file.fieldname === 'CV') {
      cb(null, './CV');
    } else {
      cb(new Error('Invalid field name'));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// POST /candidates
router.post('/register', upload.fields([
  { name: 'Image', maxCount: 1 },
  { name: 'CV', maxCount: 1 }
]), async (req, res) => {
  try {
    const candidate = new Candidate({
      Image: req.files.Image[0].filename,
      CV: req.files.CV[0].filename,
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      lastname: req.body.lastname,
      Age: req.body.Age,
      Telephone: req.body.Telephone
    });
    await candidate.save();
    res.status(201).send(candidate);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error);
  }
});
router.post('/login', async (req, res) => {
  try {
    // Check if candidate with provided email and password exists
    const candidate = await Candidate.findOne({
      email: req.body.email,
      password: req.body.password
    });
    if (!candidate) {
      return res.status(401).send('Invalid email or password');
    }

    // If candidate exists, create and return a JWT token
    const token = jwt.sign({ candidateId: candidate._id }, 'your_secret_key');
    res.send({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// get by id 
router.get('/getbyid/:id', (req, res) => {
  let id = req.params.id;
  Candidate.findOne({ _id: id }).then(
    (data) => {
      res.send(data);
    },
    (err) => {
      res.send(err);
    }
  );
})
// get all
router.get('/getall', (req, res) => {
  Candidate.find().then(
    (Offre) => {
      res.send(Offre)
    },
    (err) => {
      console.log(err);
    }
  )
});
// PUT /candidates/:id
router.put('/update/:id', upload.fields([
  { name: 'Image', maxCount: 1 },
  { name: 'CV', maxCount: 1 }
]), async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Update candidate's properties
    candidate.Image = req.files.Image ? req.files.Image[0].filename : candidate.Image;
    candidate.CV = req.files.CV ? req.files.CV[0].filename : candidate.CV;
    candidate.email = req.body.email || candidate.email;
    candidate.password = req.body.password || candidate.password;
    candidate.name = req.body.name || candidate.name;
    candidate.lastname = req.body.lastname || candidate.lastname;
    candidate.Age = req.body.Age || candidate.Age;
    candidate.Telephone = req.body.Telephone || candidate.Telephone;

    await candidate.save();
    res.status(200).json(candidate);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error);
  }
});

// POST /candidates/reset-password
const secret = 'your_jwt_secret';

router.post('/reset-password', async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).send('Email is required');
    }

    const candidate = await Candidate.findOne({
      email: req.body.email
    });

    if (!candidate) {
      return res.status(404).send('No candidate found with that email address');
    }

    // Generate a password reset token
    const payload = {
      id: candidate._id,
      email: candidate.email
    };
    const resetToken = jwt.sign(payload, secret, { expiresIn: '1h' });

    candidate.resetPasswordToken = resetToken;
    candidate.resetPasswordExpires = Date.now() + 3600000; // Expires in 1 hour
    await candidate.save();

    // Send password reset email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'marouanimedyassine@gmail.com',
        pass: 'kzgcopmmtuerwhpz'
      }
    });

    const mailOptions = {
      from: 'marouanimedyassine@gmail.com',
      to: candidate.email,
      subject: 'Password Reset Request',
      text: `Hello ${candidate.name},

We received a request to reset your password. Please follow the link below to reset your password:

http://localhost:4200/reset-password/${resetToken}

If you did not request a password reset, please ignore this message.

Best regards,
Your Company`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error.message);
        return res.status(500).send('Error sending password reset email');
      }
      console.log(`Password reset email sent: ${info.response}`);
      res.send('Password reset email sent');
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});








module.exports = router;
