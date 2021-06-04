console.log("handlebars script linked")

type="text/javascript">
  $(document.getElementsByClassName("catagoryBarContainer")).on('click', 'ul li', function(){
    $(this).addClass('active').siblings().removeClass('active')
  })