var express = require('express');
var request = require('request');
var path = require('path');
var exphbs = require('express-handlebars');
var exec = require('child_process').exec;
var fs = require('fs');
var md5 = require('md5');

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

    // get topic
    var cachedFile = path.join('cache', md5(req.params.topic)+'.json');

    // check cache
    fs.readFile(cachedFile, function(err, data) {
        if(err) {
            console.log('read err:',err);
            // try to get result from jar
            var cmd = "java -jar Timelapse.jar '"+ req.params.topic +"'";
            exec(cmd, function(error, stdout, stderr) {
                console.log('get data from jar, save to cache');
                // get result, write to cache
                fs.writeFile(cachedFile, stdout, function(err){
                    if (err) {
                        console.log('write err:', err);
                    }
                    return res.send(stdout);
                });
            });
        } else {
            console.log('got data from cache');
            return res.send(JSON.parse(data));
        }
    });
});

app.get('/mock/search/topic/:topic', function(req, res, next) {

    // mock data for backend
    // ...
    var response = {
        topic: req.params.topic,
        events: [
            {
                "geo":{
                    "latitude":"47.162494",
                    "longtitude":"19.503304",
                    "location":"Hungary"
                },
                "newsContent":{
                    "abstract":"UNKOWN",
                    "source":"ndtv",
                    "title":"Paris Attack Suspect 'Recruited Team' in Hungary: Government",
                    "url":"http://www.ndtv.com/world-news/paris-attack-suspect-recruited-team-in-hungary-government-1250847"
                },
                "time":{
                    "from":"2015-12-04",
                    "toTimeStamp":"null"
                }
            },
            {
                "geo":{
                    "latitude":"48.162494",
                    "longtitude":"19.703304",
                    "location":"Hungary"
                },
                "newsContent":{
                    "abstract":"UNKOWN",
                    "source":"ndtv",
                    "title":"Paris Attack Suspect 'Recruited Team' in Hungary: Government",
                    "url":"http://www.ndtv.com/world-news/paris-attack-suspect-recruited-team-in-hungary-government-1250847"
                },
                "time":{
                    "from":"2015-12-04",
                    "toTimeStamp":"null"
                }
            },
            {
                "geo":{
                    "latitude":"46.17",
                    "longtitude":"19.85",
                    "location":"Hungary"
                },
                "newsContent":{
                    "abstract":"UNKOWN",
                    "source":"ndtv",
                    "title":"Senior Officer Says London Police Could Handle Paris-Style Attack",
                    "url":"http://www.ndtv.com/world-news/senior-officer-says-london-police-could-handle-paris-style-attack-1250008"
                },
                "time":{
                    "from":"2015-12-02",
                    "toTimeStamp":"null"
                }
            },
            {
                "geo":{
                    "latitude":"44.17",
                    "longtitude":"19.99",
                    "location":"Hungary"
                },
                "newsContent":{
                    "abstract":"UNKOWN",
                    "source":"ndtv",
                    "title":"Senior Officer Says London Police Could Handle Paris-Style Attack",
                    "url":"http://www.ndtv.com/world-news/senior-officer-says-london-police-could-handle-paris-style-attack-1250008"
                },
                "time":{
                    "from":"2015-12-02",
                    "toTimeStamp":"null"
                }
            },
            {
                "geo":{
                    "latitude":"48.856614",
                    "longtitude":"2.3522219",
                    "location":"Paris"
                },
                "newsContent":{
                    "abstract":"UNKOWN",
                    "source":"ndtv",
                    "title":"David Beckham, Wayne Rooney Pay Tribute to Paris Attack Victims",
                    "url":"http://sports.ndtv.com/article/252556"
                },
                "time":{
                    "from":"2015-12-01",
                    "toTimeStamp":"null"
                }
            }
        ]
    };

    return res.send(response);
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


