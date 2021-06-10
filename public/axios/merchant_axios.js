
//button to update merchant username
  let editMerchantbtn = document.querySelector("#updateMerchantName")

editMerchantbtn.addEventListener('click',() => {
    console.log("hello you clicked me")
    let edit = {
        merchantName:document.querySelector("#merchantName").value
    }
    console.log("this is edit", edit);
    axios.put('/shop/merchant-name',edit)
    .then(()=> {
        console.log("edit from axios username")
    })
    .catch((error)=> {
        console.log("error", error);
    })
});


let editMerchantDescriptionbtn = document.querySelector("#Description")

editMerchantDescriptionbtn.addEventListener('click',() => {
    console.log("hello you clicked me")
    let edit = {
        shopDescription:document.querySelector("#updateShopDescription").value
    }
    console.log("this is edit", edit);
    axios.put('/shop/merchant-Description',edit)
    .then(()=> {
        console.log("edit from axios shopUpdate description")
    })
    .catch((error)=> {
        console.log("error", error);
    })
});
