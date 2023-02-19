const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
// Import the Recruteur model
const Recruteur = require("../models/Recruteur");

// Set up multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Max size is 5MB
    },
    fileFilter: fileFilter
});

// Route to register a Recruteur
router.post("/register", upload.single("Image"), async (req, res) => {
    try {
        // Check if the email is already in use
        const existingRecruteur = await Recruteur.findOne({ email: req.body.email });
        if (existingRecruteur) {
            return res.status(400).json({ msg: "Email already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new Recruteur
        const recruteur = new Recruteur({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
            lastname: req.body.lastname,
            Company: req.body.Company,
            Image: req.file.filename,
            Role: 2
        });

        // Save the Recruteur to the database
        await recruteur.save();

        res.status(200).json({ msg: "Recruteur registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
});
// login 
router.post("/login", async (req, res) => {
    try {
        // Check if the email exists
        const recruteur = await Recruteur.findOne({ email: req.body.email });
        if (!recruteur) {
            return res.status(400).json({ msg: "Email not found" });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(req.body.password, recruteur.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }

        // Create a JSON Web Token
        const payload = {
            recruteur: {
                id: recruteur.id
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
    Recruteur.findOne({ _id: id }).then(
        (data) => {
            res.send(data);
        },
        (err) => {
            res.send(err);
        }
    );
})
// delete
router.delete('/delete/:id', (req, res) => {
    id = req.params.id;
    Recruteur.findByIdAndDelete({ _id: id }).then(
        (deletedRecruteur) => {
            console.log(`Recruteur ${deletedRecruteur} deleted`);
            res.send(deletedRecruteur);
        },
        (err) => {
            res.send(err);
        }
    );
});
// modifier un recrtuer :
router.put("/update/:id", upload.single("Image"), async (req, res) => {
    try {
        let id = req.params.id;
        let RecruteurToUpdate = req.body;
        if (req.file) {
            RecruteurToUpdate.Image = req.file.filename;
        }

        const updatedRecruteur = await Recruteur.findByIdAndUpdate(
            { _id: id },
            RecruteurToUpdate,
            { new: true }
        );

        if (!updatedRecruteur) {
            return res.status(404).json({ msg: "Recruteur not found" });
        }

        res.status(200).json(updatedRecruteur);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
});
//get all = working 100% ( requires a token to run)
router.get('/getall', (req, res) => {
    Recruteur.find().then(
        (Recruteur) => {
            res.send(Recruteur)
        },
        (err) => {
            console.log(err);
        }
    )
});
module.exports = router;
