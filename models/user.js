//set user schema 

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const db_1 = require('../db');

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {timestamps: true});


//hash in save user
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }catch(error) {
            return next(error)
        }
    };

    next();
});
//delete password field in show profile
UserSchema.set('toObject', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
})

module.exports = db_1.model('User', UserSchema);