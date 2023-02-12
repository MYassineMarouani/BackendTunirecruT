const express = require("express");
const router = express.Router();
const Offre = require("../models/Offre");
const multer = require("multer");
const path = require("path");

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

// Route to register a Offre
router.post("/add", upload.single("Banner"), async (req, res) => {
    try {
        const offre = new Offre({
            idRecruter: req.body.idRecruter,
            Position: req.body.Position,
            Description: req.body.Description,
            Banner: req.file.filename
        });

        // Save the Offre to the database
        await offre.save();

        res.status(200).json({ msg: "offre registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
});
// get by id 
router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id;
    Offre.findOne({ _id: id }).then(
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
    Offre.findByIdAndDelete({ _id: id }).then(
        (deletedOffre) => {
            console.log(`Offre ${deletedOffre} deleted`);
            res.send(deletedOffre);
        },
        (err) => {
            res.send(err);
        }
    );
});
// modify offer
// Route to update an offer
router.put('/update/:id', upload.single('image'), (req, res) => {
    let id = req.params.id;
    let OffreToUpdate = req.body;

    Offre.findByIdAndUpdate({ _id: id }, OffreToUpdate, { new: true }).then(
        (updatedOffre) => {
            res.send(updatedOffre);
        },
        (err) => {
            res.send(err);
        }
    );
});

// get all offers
router.get('/getall', (req, res) => {
    Offre.find().then(
        (Offre) => {
            res.send(Offre)
        },
        (err) => {
            console.log(err);
        }
    )
});
// get offer by idRecruter 
router.get("/getbyidrecruter/:idRecruter", async (req, res) => {
    try {
        const offer = await Offre.findOne({ idRecruter: req.params.idRecruter });

        if (!offer) {
            return res.status(404).json({ msg: "Offer not found" });
        }

        res.json(offer);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;