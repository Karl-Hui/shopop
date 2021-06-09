"use strict";

// console.log("loads");
let deleteBtn = document.querySelector(".deleteBtn");

deleteBtn.addEventListener("click", (e) => {
  let id = deleteBtn.getAttribute("data-value");
  axios({
      method: "delete",
      baseURL: `http://localhost:8080`,
      url: `/shop/api/delete/product/${id}`,
      // "Content-Type": "application/json",
    })
    .then((result) => {
      console.log(result.data);
    })
    .catch((err) => {
      console.error(err);
    });
});