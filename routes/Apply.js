const express = require('express');
const router = express.Router();
const Apply = require('../models/Apply');

router.post('/add', async (req, res) => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const apply = new Apply({
      idRecruter: req.body.idRecruter,
      idCandidate: req.body.idCandidate,
      idOffer : req.body.idOffer,
      Date: formattedDate,
      Etat: 'In Progress'
    });

    await apply.save();
    res.status(201).send(apply);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error);
  }
});
// get by id offer
router.get("/getbyidOffer/:idOffer", async (req, res) => {
    try {
      const apply = await Apply.find({ idOffer: req.params.idOffer });
  
      if (!apply) {
        return res.status(404).json({ msg: "applies not found" });
      }
  
      res.json(apply);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server error" });
    }
  });
  // get by id candidate
  router.get("/getbyidCandidate/:idCandidate", async (req, res) => {
    try {
      const apply1 = await Apply.find({ idCandidate: req.params.idCandidate });
  
      if (!apply1) {
        return res.status(404).json({ msg: "applies not found" });
      }
  
      res.json(apply1);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server error" });
    }
  });



module.exports = router;
