var conn = require('./../model/db')
var users = require('./../model/users')
var func = require('./../model/func')
var client = require('./../model/client')
var uploadRequire = require('./../model/upload')
var edit = require('./../model/editemployees')
var editCli = require('./../model/editclient')
var express = require('express');
var fs = require('fs');
var router = express.Router();
var multer = require('multer')
//var upload = multer({ dest: '/home/yummi/Área de trabalho/Projeto/funcionario/model/documents/' })
var upload = multer({ dest: '/usr/src/app/model/documents/' })

var app = express();


router.use(function (req, res, next) {

  var options = {
    host: 'mysql742.umbler.com',
    port: 3306,
    user: 'db-root',
    password: 'leo91167213',
    database: 'session'
  };

  var sessionStore = new MySQLStore(options);

  app.use(session({
    key: 'yuumi',
    secret: 'yuumi',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
  }));

  /*var connection;

  function handleDisconnect() {
    connection = mysql.createConnection(options); // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function (err) {              // The server is either down
      if (err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 3000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
      console.log('db error', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }

  handleDisconnect();*/

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
    res.render('login', {
      error: 'Login ou senha incorreto'
    });
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
    //cb(null, '/home/yummi/Área de trabalho/Projeto/funcionario/model/documents/')
    cb(null, '/usr/src/app/model/documents/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage });

router.post('/upload', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  if (req.get('Referrer') != undefined) {
    url = req.get('Referrer').toString()
    url = url.split('/')
    var previousUrl = url[url.length - 1];
    previousUrl = '/' + previousUrl
  }

  uploadRequire.uploadArchive(req.file.originalname, req.query.v).then(results => {
    console.log('True')
    res.redirect(previousUrl)

  }).catch(err => {
    console.log(err)
    res.redirect(previousUrl)
  })

})

// UPLOAD 


router.get('/documents', function (req, res, next) {
  //res.download("/home/yummi/Área de trabalho/Projeto/funcionario/model/documents/" + req.query.file)
  res.download("/usr/src/app/model/documents/" + req.query.file)
})

router.get('/delete', function (req, res, next) {

  //fs.unlinkSync("/home/yummi/Área de trabalho/Projeto/funcionario/model/documents/" + req.query.file)
  fs.unlinkSync("/usr/src/app/model/documents/" + req.query.file)
  conn.query(
    'DELETE FROM files WHERE files.file ="' + req.query.file + '";',
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        if (req.get('Referrer') != undefined) {
          url = req.get('Referrer').toString()
          url = url.split('/')
          var previousUrl = url[url.length - 1];
          previousUrl = '/' + previousUrl
        }
        res.redirect(previousUrl)
      }
    }
  );
})




router.get('/cadasterclient', function (req, res, next) {

  res.render('cadasterclient', {
    active: 'cadasterclient',
    menu: 'cadasterclient'
  });

})
router.post('/cadasterclient', function (req, res, next) {

  client.postClient(req.body).then(results => {
    res.render('cadasterclient', {
      success: 'Cadastro realizado com sucesso',
      active: 'cadasterclient',
      menu: 'cadasterclient'
    })
  }).catch(err => {
    res.render('cadasterclient', {
      error: err.toString(),
      active: 'cadasterclient',
      menu: 'cadasterclient'
    })
  })
})

router.get('/editclient', function (req, res, next) {

  conn.query(
    'SELECT * FROM client WHERE cpf = "' + req.query.v + '";',
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        res.render('editclient', {
          active: 'editclient',
          menu: 'editclient',
          edit: results
        });
      }
    }
  );

})

router.post('/editclient', function (req, res, next) {
  editCli.editClient(req.query.v, req.body).then(results => {
    console.log('FUNCINOUUUUUU')
    res.redirect("/clients")

  }).catch(err => {
    console.log(err)
    res.redirect("/clients")
  })


})


router.get('/clients', function (req, res, next) {

  if (req.query.v == undefined) {
    conn.query(
      'SELECT * FROM client ORDER BY name;',
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          res.render('clients', {
            active: 'clients',
            menu: 'clients',
            cli: results,
            files: "not"
          });
        }
      }
    );

  } else {
    conn.query(
      'SELECT * FROM client ORDER BY name;',
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
                res.render('clients', {
                  active: 'clients',
                  menu: 'clients',
                  cli: results,
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


module.exports = router;


