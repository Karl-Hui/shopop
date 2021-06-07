"use strict";
// const axios = require('axios').default

// console.log("loads")
// let deleteBtn = document.querySelector(".deleteBtn");
// // let editBtn = document.querySelector(".editBtn");


// deleteBtn.addEventListener("click", (e) => {
//     console.log("clicked")
//     let id = e.target.dataset.target
//     axios.delete(`/shop/api/delete/product/${id}`)
//         .then(() => {
//             console.log("deleted from front end")
//             window.location.href = '/shop/merchant-homepage';
//         }).catch((error) => {
//             console.log("Error deleting!!!", error)
//         })
// })

// editBtn.addEventListener("click", (e) => {
//     // console.log(e.target.dataset.target)
//     let id = e.target.dataset.target
//     console.log(id)
// })

$(".deleteBtn").click((e) => {
    let id = e.target.dataset.target
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

// $(".editBtn").click((e) => {
//     e.preventDefault();
//     let id = e.target.dataset.target
//     console.log("edit+++++++++")
//     $.ajax({
//         type: "post",
//         url: `/shop/api/product/edit/${id}`,
//         dataType: "json",
//         success: function () {
//             console.log("update success");
//         },
//     })
//     //     .done(
//     //         setTimeout(() => {
//     //             window.location.reload();
//     //         }, 500)
//     //     );
// });