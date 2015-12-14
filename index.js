var express = require('express');
var request = require('request');
var path = require('path');
var exphbs = require('express-handlebars');

var app = express();

// view engine setup
app.engine('.tpl', exphbs({
    defaultLayout: 'single',
    extname: '.tpl'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.tpl');

// server route
app.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Timelapse News'
    });
});

app.get('/api/search/topic/:topic', function(req, res, next) {
    // mock data for backend
    // ...
    var response = {
        topic: req.params.topic,
        events: [
            {
                'title': 'kerker',
                'abstract': 'ker ker ker'
            }
        ]
    };
    return res.send(JSON.stringify(response));
});

app.get('/api/search/query/:query', function(req, res, next) {
    // mock data for backend
    // ...
    var response = {
        input: req.params.query,
        suggestion: req.params.query + 'kerker'
    };
    return res.send(JSON.stringify(response));
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


