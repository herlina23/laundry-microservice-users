const mongoose = require("mongoose");

//Map Global Promises
mongoose.Promise = global.Promise;

const db = require('./keys').MongoURL;
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log("MongoDB Connected ..."))
    .catch(err => console.log(err))