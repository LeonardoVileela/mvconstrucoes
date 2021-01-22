
var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', {
  });
})

router.post('/', function (req, res, next) {

  user = 'mvconstrucoes@mvconstrucoesms.com.br'
  pass = '@leo91167213'

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    host: 'smtp.umbler.com',
    port: 587,
    auth: {
      user,
      pass
    }
  }); req.body.email, req.body.password

  transporter.sendMail({
    from: user,
    to: req.body.email,
    subject: 'Ficamos Feliz por ter você aqui!',
    text: 'Obrigado pelo seu contato, responderemos sua mensagem o mais rápido possível.'
  }).then(info => {
    res.render('index', {
      success: 'E-mail enviado com sucesso. Agradecemos o contato, retornaremos o mais rápido possível.'
    })

  }).catch(error => {
    res.render('index', {
      error: 'Sinto muito. O seu E-mail não foi enviado, mas estamos tentando resolver o mais rápido possível.'
    })
  })

  transporter.sendMail({
    from: user,
    to: 'leovilela.empresa@gmail.com',
    replyTo: req.body.email,
    subject: req.body.subject,
    text: 'Nome: ' + req.body.name +
      '/Email: ' + req.body.email +
      ' /Mensagem: ' + req.body.message
  }).then(info => {
    console.log(info)

  }).catch(error => {
    console.log(error)
  })

})


module.exports = router;