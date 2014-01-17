var lzd = {};

lzd.compare = function(container){
  this.container = $(container);
  this.form = this.container.find('form');
  this.results = this.container.find('[data-role="results"]')
  this.submit_button = this.container.find('[data-role="submit_button"]');
  this.init_events();
};

lzd.compare.prototype.init_events = function(){
  this.form.validate({
    rules: {
      first_url: {
        minlength: 2,
        required: true
      },
      second_url: {
        minlength: 2,
        required: true
      }
    }
  });
  this.form.submit($.proxy(this.submit, this));
};

lzd.compare.prototype.submit = function(_){
  if(this.form.valid()){
    var that = this;

    this.submit_button.button('loading');
    this.results.html('');

    $.ajax({
      url: "/compare",
      type: "POST",
      data: that.form.serialize(),
      success: function(data){
        that.submit_button.button('reset');
        that.results.html(data);
      },
      error: function(){ alert('error') }
    });
  }
  return false;
};

$(function(){
  new lzd.compare('[data-role="compare"]');
});
