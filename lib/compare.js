var request = require('request')
  , cheerio = require('cheerio')
  , q = require('q')
;

var compare = function(req, res){
  var first_url = req.body.first_url
    , second_url = req.body.second_url
    , specs = {}
  ;

  var parse_specs = function(body){
    var $ = cheerio.load(body)
      , specs_containers = $('#productSpecifications tr')
      , deferred = q.defer()
    ;

    specs_containers.each(function(){
      var title = $(this).find('th').html(); //NOTE(NE): SKU has different structure but I don't think we need it.
      if(!title){ return true; }
      var value = $(this).find('td').html();

      specs[title] = specs[title] || [];
      specs[title].push(value);
    });

    deferred.resolve();
  };

  var make_request = function(url){
    var deferred = q.defer();
    request({uri: url}, function(err, response, body){
      if(err && response.statusCode !== 200){
        res.send(500, { error: 'something blew up' })
      }

      deferred.resolve(body);
    });

    return deferred.promise;
  };

  make_request(first_url)
    .then(parse_specs)
    .then(function(){ return make_request(second_url); })
    .then(parse_specs)
    .then(function(){ return res.render('compare', {specs: specs}); })
  ;
};


module.exports = compare;
