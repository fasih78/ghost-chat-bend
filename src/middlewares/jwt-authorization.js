const jwt = require("jsonwebtoken");
const LogInfoModel = require ('../DashBoard/user.js/log_info_model')
// const express = require("express");

const users = [];
const verifyUserToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (err) {


    res.status(400).send("Invalid token  and User logout!.");
  }
};


module.exports = verifyUserToken ;
