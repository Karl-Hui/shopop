let updateBtn = document.querySelector(".cart");

updateBtn.addEventListener("mouseleave", () => {
  console.log("click");
  let productInCarts = document.querySelectorAll(".cart-items");
  let obj = {};
  for (let i = 0; i < productInCarts.length; i++) {
    let productInCart = productInCarts[i];
    let productId = productInCart.getAttribute("data-value");
    let quantity = productInCart.querySelector(".cart-quantity-input").value;

    [(obj[productId] = quantity)];
  }
  //   console.log(obj);
  axios.post("/cart", obj);
});
