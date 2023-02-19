const mongoose = require('mongoose');
const CandidateRole = new mongoose.Schema({

    email: { type: String },
    password: { type: String },
    name : {type : String},
    lastname : {type : String},
    Age : {type : Number},
    Image : {type : String} ,
    CV : {type : String},
    Telephone : {type : String},
});

module.exports = mongoose.model('Candidate', CandidateRole);;