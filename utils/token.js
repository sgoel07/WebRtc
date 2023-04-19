"use strict";

const jwt =require('jsonwebtoken');
const jwtSecretKey=process.env.JWT_SECRET;

exports.jwtSign = (user) =>{
    return jwt.sign({user,exp: Math.floor(Date.now() / 1000) + (60 * 60) * 24 * 30},jwtSecretKey);
}

exports.jwtVerify =(token) =>{
    try {
        let decode = jwt.verify(token , jwtSecretKey);
        return decode && decode.user
    } catch (error) {
        return false 
    }
}

