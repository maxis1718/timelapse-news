var express = require('express');
var request = require('request');
var path = require('path');
var exphbs = require('express-handlebars');

var app = express();

// view engine setup
app.engine('.tpl', exphbs({
	extname: '.tpl'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.tpl');

// server route
app.get('/', function(req, res, next) {
	res.render('index');
});

app.get('/tt', function(req, res) {
	res.render('tt');
});

app.get('/test', function(req, res) {
	res.render('test');
});

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


