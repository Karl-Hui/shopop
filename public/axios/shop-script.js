

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
