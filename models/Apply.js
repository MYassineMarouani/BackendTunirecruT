const mongoose = require('mongoose');
const ApplyRole = new mongoose.Schema({

    idRecruter: { type: String },
    idCandidate: { type: String },
    idOffer: { type: String },
    Date : {type : String},
    Etat : {type : String},
});

module.exports = mongoose.model('Apply', ApplyRole);;