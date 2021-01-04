var conn = require('./../model/db')
var users = require('./../model/users')
var func = require('./../model/func')
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
  
  conn.query(
    'SELECT SUM(salary) FROM func',
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        conn.query(
          'SELECT COUNT(cpf) FROM func',
          function (err, resultado) {
            if (err) {
              console.log(err);
            } else {
              res.render('index', {
                active: 'index',
                menu: 'index',
                contSalary: results,
                cont: resultado
              });
            }
          }
        )
      }
    }
  )

})

router.get('/cadaster', function (req, res, next) {

  res.render('cadaster', {
    active: 'cadaster',
    menu: 'cadaster'
  });

})
router.post('/cadaster', function (req, res, next) {

  func.postFunc(req.body).then(results => {
    res.render('cadaster', {
      success: 'Cadastro realizado com sucesso',
      active: 'cadaster',
      menu: 'cadaster'
    })
  }).catch(err => {
    res.render('cadaster', {
      error: err.toString(),
      active: 'cadaster',
      menu: 'cadaster'
    })
  })
})
router.get('/employees', function (req, res, next) {


  conn.query(
    'SELECT * FROM func ORDER BY name;',
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        res.render('employees', {
          active: 'employees',
          menu: 'employees',
          func: results
        });
      }
    }
  );

})

module.exports = router;


