const express = require('express');
const router = require('./routes/index');

//..
const path = require('path');
const app = express();

//...
const bodyParser = require('body-parser');

//le css
app.use(express.static('public'));

//les vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

module.exports = app;
