console.log("handlebars script linked")

  $('.catagoryBarContainer').on('click', 'ul li', function(){
    $(this).addClass('active').siblings().removeClass('active')
  })


 