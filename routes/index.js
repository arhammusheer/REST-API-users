var express = require('express');
var router = express.Router();
var User = require('../models/User');
var createError = require('http-errors');
var faker = require('faker');
const rateLimit = require("express-rate-limit");

const generateuserLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message:
    "Too many accounts created from this IP, please try again after 1 Minute"
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    "message":"success"
  });
});

router.get('/api', function(req, res, next){
  res.json({
    "message":"success",
    "allowed paths":[
      "GET - /api/users - show all users",
      "GET - /api/users/generate-random - generate random user Faker.js",
      "GET - /api/users/:id - Show users by ID",
      "POST - /api/users - Create New users",
      "DELETE - /api/users/:id - Delete user with given ID",
      "PUT - /api/users/:id - Update User with given params"
    ]
  });
});

//USER API
router.get('/api/users', async function(req, res, next){
  var allUsers = await User.find({});
  res.json({
    "message":"success",
    "data":allUsers
  });
});

router.post('/api/users', function(req, res, next){
  if(req.body.firstname && req.body.lastname && req.body.email && req.body.phone){
    var user = new User({
      "firstname":req.body.firstname,
      "lastname":req.body.lastname,
      "email":req.body.email,
      'phone':req.body.phone
    });
    user.save(function(err){
      if(err){
        res.json({
          "message":"warning",
          "error":"Database Conflict",
        });
      } else {
        res.json({
          "message":"User saved successfully with id " + user._id
        });
      }
    });
  } else {
    res.json({
      "message":"missing data",
      "data sent":req.body
    });
  }
});

router.get('/api/users/generate-random',generateuserLimiter ,function(req, res, next){
  var user = new User({
    "firstname":faker.name.firstName(),
    "lastname":faker.name.lastName(),
    "email":faker.internet.email(),
    "phone":faker.phone.phoneNumber()
  });
  user.save();
  res.json({
    "message":"success",
    "data":user
  });
});

router.get('/api/users/:id', async function(req, res, next){
  User.findById(req.params.id, function(err, data){
    if(err) {
      res.status(404).json({
        "message":"warning",
        "error":"not found"
      });
    } else {
      res.json({
        "message":"success",
        "data":data
      });
    }
  });
});

router.put('/api/users/:id', function(req, res, next){
  User.findById(req.params.id, function(err, data){
    if(err) {
      res.json({
        "message":"warning",
        "error":"not found"
      });
    } else {
      if(req.body.firstname) data.firstname = req.body.firstname;
      if(req.body.lastname) data.lastname = req.body.lastname;
      if(req.body.email) data.email = req.body.email;
      if(req.body.phone) data.phone = req.body.phone;
      data.save();
      res.json({
        "message":"success",
        "data":data
      });
    }
  });
});

router.delete('/api/users/:id', function(req, res, next){
  User.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.status(500).json({
        "message":"error",
        "error":err
      });
    } else {
      res.json({
        "message":"Deleted Successfully",
      });
    }
  });
  res.json({
    "message":"not implemented"
  });
});


module.exports = router;
