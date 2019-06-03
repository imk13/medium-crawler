const mongoose = require('mongoose'),
    config = require('./config'),
    worker = require('./worker');
// Setup mongodb connections    
mongoose.connect(config.MONGO.HOST, { useCreateIndex: true, useNewUrlParser: true });
let mongodb = mongoose.connection;
// on mongodb connection error
mongodb.on('errror', function(err) {
    console.error(err);
    process.exit(1);
});

//Intiate crawling
worker();


process.on('unhandledRejection', (err) => {
    console.error(err);
});