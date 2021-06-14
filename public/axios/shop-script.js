$(".deleteBtn").click((e) => {
  let id = e.target.dataset.target;
  $.ajax({
    type: "DELETE",
    url: `/shop/api/delete/product/${id}`,
    success: function () {
      console.log("delete success");
    },
  }).done(
    setTimeout(() => {
      window.location.replace("/shop/merchant-homepage");
    }, 500)
  );
});
