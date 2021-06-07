console.log("handlebars script linked")

  $(document.getElementsByClassName("catagoryBarContainer")).on('click', 'ul li', function(){
    $(this).addClass('active').siblings().removeClass('active')
  })