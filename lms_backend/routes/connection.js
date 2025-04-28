const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {console.log(`DB connection is Failed!`),console.log(err)});

const db = mongoose.connection
module.exports = db;