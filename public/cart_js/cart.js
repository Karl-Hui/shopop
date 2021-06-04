if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  let removeCartItemButtons = document.getElementsByClassName("close");
  for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  let quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
  updateCarTotal();
  theEmptyCart();
}

function removeCartItem(event) {
  let buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.parentElement.remove();
  updateCarTotal();
}

function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCarTotal();
}

function updateCarTotal() {
  let cartItemContainers = document.getElementsByClassName("cart-items");
  // console.log("cartItemContainer", cartItemContainer);
  // let cartRows = cartItemContainer.getElementsByClassName("cart-row");
  // console.log("cartRows", cartRows);
  let total = 0;
  let finalQuantity = 0;
  for (let i = 0; i < cartItemContainers.length; i++) {
    let cartItemContainer = cartItemContainers[i];
    let priceElement =
      cartItemContainer.getElementsByClassName("cart-price")[0];
    let quantityElement = cartItemContainer.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    let price = parseFloat(priceElement.innerText.replace("$", ""));
    quantity = quantityElement.value;
    finalQuantity = parseInt(finalQuantity) + parseInt(quantity);
    total = total + price * quantity;
    // console.log("priceElement", priceElement);
  }
  document.getElementsByClassName("item-quantity")[0].innerHTML =
    "Total Items: " + finalQuantity;
  // console.log("finalQuantity", finalQuantity);
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "$ " + total;
  document.getElementsByClassName("total-price")[0].innerText =
    "$ " + (total + 5);
  theEmptyCart();
}

function theEmptyCart() {
  let cartItem = document.getElementsByClassName("cart-row")[0];

  // document.getElementsByClassName("emptyCart")
  // console.log(cartItem);
  if (cartItem === undefined) {
    let para = document.createElement("p");
    let node = document.createTextNode("The cart is empty.");
    para.appendChild(node);
    let element = document.getElementById("div1");
    element.appendChild(para);
  }
}
