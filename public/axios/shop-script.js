// "use strict";
// // const axios = require('axios').default

console.log("loads");
let deleteBtn = document.querySelector(".deleteBtn");

deleteBtn.addEventListener("click", (e) => {
  // console.log(e.target.dataset.target)
  //   let id = e.target.dataset.target;
  let id = deleteBtn.getAttribute("data-value");
  //   axios
  //     .delete(`/shop/api/delete/product/${id}`)
  //     .then(() => {
  //       console.log("deleted from front end");
  //     })
  //     .catch((error) => {
  //       console.log("Error deleting!!!", error);
  //     });
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
