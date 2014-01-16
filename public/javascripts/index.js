$(function(){

  $('form').submit(function(e){
    $.ajax({
      url: "/compare",
      type: "POST",
      data: $(this).serialize(),
      success: function(){ console.log("arguments: ", arguments) },
      error: function(){}
    });
    return false;
  });



})
