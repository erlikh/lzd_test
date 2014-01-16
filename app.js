
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , request = require('request')
  , cheerio = require('cheerio')
  , q = require('q')
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
    second_url = req.body.urls[1],
    specs = {}
  ;

  //TODO(NE): check if URLs present.

  var parse_specs = function(body){
    var $ = cheerio.load(body)
      , specs_containers = $('#productSpecifications tr')
      , deferred = q.defer();
    ;

    specs_containers.each(function(){
      var title = $(this).find('th').html(); //NOTE(NE): SKU has different structure but I don't think we need it.
      if(!title){ return true; }
      var value = $(this).find('td').html();

      console.log(title + ': ' + value);
    });

    deferred.resolve();
  };

  var make_request = function(url){
    console.log("\nurl: ", url)
    var deferred = q.defer();
    request({uri: url}, function(err, response, body){
      if(err && response.statusCode !== 200){console.log( 'Request error.' );} //TODO(NE): stop the queue.
      deferred.resolve(body);
    });

    return deferred.promise;
  };


  make_request(first_url)
    .then(parse_specs)
    .then(function(){ return make_request(second_url); })
    .then(parse_specs)
  ;
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
