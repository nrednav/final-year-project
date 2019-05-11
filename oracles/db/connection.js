const mongoose = require('mongoose');

const mongo_uri = 'mongodb://localhost:27017/fyp';
mongoose.connect(mongo_uri, { useNewUrlParser: true });
const db = mongoose.connection;

module.exports = db;
