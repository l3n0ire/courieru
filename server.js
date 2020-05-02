const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');

//load env variables
dotenv.config({path: './config/config.env'});
connectDB();
// body parser
app.use(express.json());
app.use(cors());
// set static folder
app.use(express.static(path.join(__dirname,'public')))

app.use('/api/routes/',require('./routes/routes'))
app.use('/api/users/',require('./routes/users'))
app.use('/api/items/',require('./routes/items'))


const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running ${process.env.NODE_ENV} on port ${PORT}`));
