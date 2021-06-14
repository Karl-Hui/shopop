let addToCartBtn = document.querySelector(".addBtn");

console.log(addToCartBtn);

addToCartBtn.addEventListener("click", (e) => {
  let id = addToCartBtn.getAttribute("data-value");
  fetch(`/product/${id}`, {
    method: "post",
  }).then((data) => {
    console.log(data);
  });
});

const addBtn = document.querySelector(".addBtn");
const stocktext = document.querySelector(".stocktext");
const productdescription = document.querySelector("#productdescription");

if (parseInt(stocktext.textContent) === 0) {
  addBtn.style.display = "none";
  productdescription.innerHTML = "<h1>Sold</h1>";
  productdescription.style.color = "#FF5A5F";
}
