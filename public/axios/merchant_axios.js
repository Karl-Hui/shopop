//button to update merchant username
let editMerchantbtn = document.querySelector("#updateMerchantName");

editMerchantbtn.addEventListener("click", () => {
  //   console.log("hello you clicked me");
  let edit = {
    merchantName: document.querySelector("#merchantName").value,
  };
  axios
    .put("/shop/merchant-settings", edit)
    .then((data) => {
      document.querySelector("#merchant-words").innerHTML = data.data;
    })
    .catch((error) => {
      console.log("error", error);
    });
});

let editMerchantDescriptionbtn = document.querySelector("#Description");

editMerchantDescriptionbtn.addEventListener("click", () => {
  //   console.log("hello you clicked me");
  let edit = {
    shopDescription: document.querySelector("#updateShopDescription").value,
  };
  //   console.log("this is the  edit data", edit);
  axios
    .put("/shop/merchant-setting", edit)
    .then((DATA) => {
      //   console.log(DATA);
      document.querySelector("#shopDescription-words").innerHTML = DATA.data;
    })
    .catch((error) => {
      console.log("error", error);
    });
});
