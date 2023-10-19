require('express-async-errors')
const express = require('express');
const mongoose = require('mongoose')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const config = require('config')
const winston = require('winston')
require('winston-mongodb')
const genres = require('./routes/genres');
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const app = express();

process.on('uncaughtException',(ex)=>{
    console.log('WE GOT AN UNCAUGHT EXCEPTION');
    winston.error(ex.message,ex)
     process.exit(1)
})

process.on('unhandledRejection',(ex)=>{
    throw ex
})

winston.add(new winston.transports.File({filename:'logfile.log'}))
winston.add(new winston.transports.MongoDB({
    db:'mongodb://localhost/vidly',
    options:{
        useUnifiedTopology: true 
    }
}));

if (!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined.')
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly')
.then(()=>console.log('Connected to MongoDB'))
.catch(err=>console.error('Could not connect to MongoDB...',err))

app.use(express.json());
app.use('/api/genres',genres);
app.use('/api/customers',customers);
app.use('/api/movies',movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error)

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Listening in port ${port}`);
})