var conn = require('./../model/db')
var users = require('./../model/users')
var express = require('express');
var router = express.Router();


router.use(function (req, res, next) {

  if (['/login'].indexOf(req.url) == -1 && !req.session.user) {
    res.redirect("/login")
  } else {
    next()
  }

})

router.get('/login', function (req, res, next) {


  res.render('login', {
  });

})


router.post('/login', function (req, res, next) {

  users.login(req.body.email, req.body.password).then(user => {
    req.session.user = user

    res.redirect('/')

  }).catch(err => {
    res.render('/login', {
    })
  })

})

router.get('/logout', function (req, res, next) {

  delete req.session.user
  res.redirect("/login")
  

})

router.get('/', function (req, res, next) {

  res.render('index', {
    active: 'index',
    menu: 'index'
  });

})

router.get('/cadaster', function (req, res, next) {

  res.render('cadaster', {
    active: 'cadaster',
    menu: 'cadaster'
  });

})
router.post('/cadaster', function (req, res, next) {

  res.render('index', {
    active: 'index',
    menu: 'index'
  });

})
router.get('/employees', function (req, res, next) {

  res.render('employees', {
    active: 'employees',
    menu: 'employees'
  });

})

module.exports = router;


