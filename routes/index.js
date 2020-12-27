var conn = require('./../model/db')
var users = require('./../model/users')
var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {

    res.render('index', {
        active: 'index'
    });

})

router.get('/cadaster', function (req, res, next) {

  res.render('cadaster', {
      active: 'cadaster'
  });

})
router.get('/employees', function (req, res, next) {

  res.render('employees', {
      active: 'employees'
  });

})

module.exports = router;


