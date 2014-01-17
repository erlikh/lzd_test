$(function(){

  $('[data-role="urls_form"]').submit(function(_){
    $.ajax({
      url: "/compare",
      type: "POST",
      data: $(this).serialize(),
      success: function(data){
        $('[data-role="compare"]').html(data);
      },
      error: function(){}
    });
    return false;
  });

});
