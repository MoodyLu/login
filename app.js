const express = require ('express');
const mongoose = require('mongoose');
const authRouters = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const session = require('express-session');
const db_1 = require('./db');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


require('dotenv').config();


const app = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'pug');
app.use(cookieParser());





//app.use(passport.initialize());
//app.use(passport.session());

app.use('/', authRouters);
app.use('/', dashboardRoutes);


app.listen(port, () => {
    console.log(`listen on port ${port}`);
})