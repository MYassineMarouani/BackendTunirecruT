const mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;
const Offre = new mongoose.Schema({

    idRecruter: { type: ObjectId }, 
    Position : {type : String},
    Description : {type : String},
    Banner : {type : String} ,

});

module.exports = mongoose.model('Offre', Offre);;