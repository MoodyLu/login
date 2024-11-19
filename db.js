//connect to database_1

const express = require("express");
const mongoose = require('mongoose');

require('dotenv').config();

const db_1 = mongoose.createConnection(process.env.mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db_1.on('connected', () => {
    console.log('connect to altas')
});

db_1.on('error', (err) => {
    console.error(err.message)
});

module.exports = db_1;