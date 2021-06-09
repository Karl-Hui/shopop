let addToCartBtn = document.querySelector(".addBtn");

console.log(addToCartBtn);

addToCartBtn.addEventListener("click", (e) => {
  let id = addToCartBtn.getAttribute("data-value");
  // console.log(id);
  // axios.post(`/product/${id}`);

  //   .catch((err) => {
  //     console.log(err.response.data);
  //   });
  // axios({
  //   method: "post",
  //   url: `/product/${id}`,
  // });
  fetch(`/product/${id}`, {
    method: "post",
  }).then((data) => {
    console.log(data);
  });
});
