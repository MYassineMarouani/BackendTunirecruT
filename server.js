const express = require('express');
const app = express();
const cors = require('cors');
require('./Config/db_config');
app.use(express.json());
app.use(cors());
const AdminApi = require('./routes/Admin');
const RecruteurApi = require('./routes/Recruteur');
const OffreApi = require('./routes/Offre');
const CandidateApi = require('./routes/Candidate');
const ApplyApi = require('./routes/Apply');
app.use('/Admin' , AdminApi);
app.use('/Recruteur' , RecruteurApi);
app.use('/Candidate' , CandidateApi);
app.use('/Offre' , OffreApi);
app.use('/Apply',ApplyApi);
app.use('/getimage' , express.static('./images'));
app.use('/getCV',express.static('./CV'));
app.listen(3000, () => {
    console.log('server works!');
})


