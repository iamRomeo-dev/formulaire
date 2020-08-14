//Module pour afficher les photos
fs = require('fs');
var nodemailer = require('nodemailer');

const express = require('express');

var User = require('../models/collection');

const router = express.Router();
//...
const { check, validationResult, matchedData } = require('express-validator');
//....
const mongoose = require('mongoose');
const maCollection = mongoose.model('utilisateurs');

//......
const path = require('path');
const auth = require('http-auth');


const basic = auth.basic({
	file: path.join(__dirname, '../users.htpasswd'),
});


/*=============Routes /GET==============*/

// Route /page d'accueil
router.get('/', /*basic.check(*/(req, res) => {
	res.status(200).render('accueil', { 
	});
})/*)*/;//Faire attention, c'est pour mettre un mot de passe

// Route /formulaire d'inscription
router.get('/form', (req, res) => {
	res.status(200).render('form');
});

// Route /formulaire de connection
router.get('/login', (req, res) => {
	res.status(200).render('login');
});

// GET /Mot de passe oublié via nodemailer
router.get('/mdpOublie', (req, res) => {
	res.status(200).render('mdpOublie');
});

/*=============POST==============*/

// POST /formulaire
router.post('/form', 
	[
	check('name')
	.isLength({ min: 1 })
	.withMessage('-Please, enter the name-')
	.trim(),
	check('firstname')
	.isLength({ min: 1 })
	.withMessage('-Please, enter the firstname-')
	.trim(),
	check('email')
	.isEmail()
	.withMessage('-Please enter an email-')
	.bail()
	.trim()
	.normalizeEmail(),
	check('password')
	.isLength({ min: 6 })
	.withMessage('-Please, enter the password-')
	.trim(),
	check('confirmPassword')
	.isLength({ min: 6 })
	.withMessage('-Please, re-enter your password-')
	.trim(),
	],
	(req, res, next) => {
		const errors = validationResult(req);
		
//si password et confirmPassword pas semblable : ca redirige
if (req.body.password !== req.body.confirmPassword) {
	var err = new Error();
	err.status = 400;
	return next('Les mots de passe ne correspondent pas');
}
if (errors.isEmpty()) {
	const creationCollection = new maCollection(req.body);
	creationCollection.save()
	.then(() => { res.render('firstlogin'); })
	.catch((err) => {
		console.log(err);
		res.send('.: Sorry! Something went wrong :.');
	}
	);
} else {
	res.render('form', { 
		errors: errors.array(),
		data: req.body,
	});
}
});

// POST /formulaire de connection
router.post('/login', (req, res) => {
	if (req.body.email && req.body.password) {
		User.authenticate(req.body.email, req.body.password, function (error, user) {
      //====if affichage de l'image si lors de la connexion le mail ou le password est faux====
      if (error || !user) {
      	var err = new Error('Wrong email or password.');
      	err.status = 401;
      	var jurassicGif = fs.readFileSync('./img/8LW.gif');
      	res.writeHead(200/*, {'Content-Type': 'image/jpg' }*/);
      	return res.end(jurassicGif, 'binary');
      } else {
      	return res.render('profil');
      }
  });
    //====else affichage de l'image si lors de la connexion les champs mail et password ne sont pas remplis====
} else {
	var err = new Error('Email and password are required.');
	err.status = 401;
	var bak = fs.readFileSync('./img/bak.jpg');
	res.writeHead(200, {'Content-Type': 'image/jpg' });
	return res.end(bak, 'binary');
}
});

module.exports = router;