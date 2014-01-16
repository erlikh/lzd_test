
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , request = require('request')
  , cheerio = require('cheerio')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/compare', function(req, res){
  var first_url = req.body.urls[0],
    second_url = req.body.urls[1]
  ;

  request({uri: first_url}, function(err, response, body){
    if(err && response.statusCode !== 200){console.log( 'Request error.' );}

    var $ = cheerio.load(body)
      , specs = $('#productSpecifications');
    ;

    console.log("specs: ", specs.html());
  });

  console.log("req.body: ", req.body);
  res.render('index', { title: 'Express' });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
