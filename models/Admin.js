const mongoose = require('mongoose');
const adminRole = new mongoose.Schema({

    email: { type: String },
    password: { type: String },
    role : {type : Number},
 
});

module.exports = mongoose.model('Admin', adminRole);;