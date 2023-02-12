const express = require('express');
const app = express();
require('./Config/db_config');
app.use(express.json());
const AdminApi = require('./routes/Admin');
const RecruteurApi = require('./routes/Recruteur');
const OffreApi = require('./routes/Offre');
app.use('/Admin' , AdminApi);
app.use('/Recruteur' , RecruteurApi);
app.use('/Offre' , OffreApi);
app.listen(3000, () => {
    console.log('server works!');
})


