const mongoose = require('mongoose');
const RecruteurRole = new mongoose.Schema({

    email: { type: String },
    password: { type: String },
    name : {type : String},
    lastname : {type : String},
    Company : {type : String},
    Image : {type : String} ,
    Role : {type : String},
});

module.exports = mongoose.model('Recruteur', RecruteurRole);;