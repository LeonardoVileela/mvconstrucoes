var conn = require('./../model/db')
var users = require('./../model/users')
var func = require('./../model/func')
var uploadRequire = require('./../model/upload')
var edit = require('./../model/editemployees')
var express = require('express');
var fs = require('fs');
var router = express.Router();
var multer = require('multer')
var upload = multer({ dest: '/home/yummi/Área de trabalho/Projeto/funcionario/model/documents/' })

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

router.get('/editemployees', function (req, res, next) {

  conn.query(
    'SELECT * FROM func WHERE cpf = "' + req.query.v + '";',
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        res.render('editemployees', {
          active: 'editemployees',
          menu: 'editemployees',
          edit: results
        });
      }
    }
  );

})

router.post('/editemployees', function (req, res, next) {
  edit.editEmployees(req.query.v, req.body).then(results => {
    console.log('True')
    res.redirect("/employees")

  }).catch(err => {
    console.log(err)
    res.redirect("/employees")
  })


})


router.get('/employees', function (req, res, next) {

  if (req.query.v == undefined) {
    conn.query(
      'SELECT * FROM func ORDER BY name;',
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          res.render('employees', {
            active: 'employees',
            menu: 'employees',
            func: results,
            files: "not"
          });
        }
      }
    );

  } else {
    conn.query(
      'SELECT * FROM func ORDER BY name;',
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          conn.query(
            'SELECT * FROM files WHERE cpf = "' + req.query.v + '";',
            function (err, resultado) {
              if (err) {
                console.log(err);
              } else {
                res.render('employees', {
                  active: 'employees',
                  menu: 'employees',
                  func: results,
                  files: resultado
                });
              }
            }
          )
        }
      }
    )
  }




})

// UPLOAD 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/yummi/Área de trabalho/Projeto/funcionario/model/documents/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage });

router.post('/upload', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any

  uploadRequire.uploadArchive(req.file.originalname, req.query.v).then(results => {
    console.log('True')
    res.redirect("/employees")
  }).catch(err => {
    console.log(err)
    res.redirect("/employees")
  })

})

// UPLOAD 


router.get('/documents', function (req, res, next) {
  res.download("/home/yummi/Área de trabalho/Projeto/funcionario/model/documents/" + req.query.file)
})

router.get('/delete', function (req, res, next) {
  
  fs.unlinkSync("/home/yummi/Área de trabalho/Projeto/funcionario/model/documents/" + req.query.file)

  conn.query(
    'DELETE FROM files WHERE files.file ="' + req.query.file + '";',
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/employees")
      }
    }
  );




})

module.exports = router;


