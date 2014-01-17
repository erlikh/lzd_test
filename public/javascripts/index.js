var lzd = {};

lzd.compare = function(container){
  this.container = $(container);
  this.form = this.container.find('form');
  this.results = this.container.find('[data-role="results"]');
  this.submit_button = this.container.find('[data-role="submit_button"]');

  this.init_events();
};

lzd.compare.prototype.init_events = function(){
  this.form.validate({
    rules: {
      first_url: {
        required: true,
        url: true
      },
      second_url: {
        required: true,
        url: true
      }
    }
  });
  this.form.submit($.proxy(this.submit, this));
};

lzd.compare.prototype.submit = function(e){
  e.preventDefault();
  if(!this.form.valid()){ return; }

  this.submit_button.button('loading');
  this.results.html('');

  $.ajax({
    url: "/compare",
    type: "POST",
    data: this.form.serialize(),
    success: $.proxy(this.results_fetched, this),
    error: $.proxy(this.server_failed, this)
  });
};

lzd.compare.prototype.server_failed = function(){
  this.submit_button.button('reset');
  alert('Something went wrong. Try again later'); //TODO(NE): Make it more beautiful.
};

lzd.compare.prototype.results_fetched = function(data){
  this.submit_button.button('reset');
  this.results.html(data);
};

$(function(){
  new lzd.compare('[data-role="compare"]');
});
