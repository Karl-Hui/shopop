let addToCartBtn = document.querySelector(".addBtn");

console.log(addToCartBtn);

addToCartBtn.addEventListener("click", (e) => {
  let id = addToCartBtn.getAttribute("data-value");
  console.log(id);
  axios
    .post(`/product/${id}`)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
});
