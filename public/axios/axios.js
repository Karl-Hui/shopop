console.log("linked to script axios");
//button to update username
let editbtn = document.querySelector("#updateUser")

editbtn.addEventListener('click',() => {
    console.log("hello you clicked me")
    let edit = {
        username:document.querySelector("#username").value
    }
    console.log("this is edit", edit);
    axios.put('/customer-settings',edit)
    .then(()=> {
        console.log("edit from axios username")
    })
    .catch((error)=> {
        console.log("error", error);
    })
});

//button to update address
let editbtnAddress = document.querySelector("#updateAddress")

editbtnAddress.addEventListener('click',() => {
    console.log("hello you clicked me Address")
    let editAddressData = {
        buildingAddress:document.querySelector("#updateBuilding").value,
        streetAddress:document.querySelector("#updateStreet").value,
        countryAddress:document.querySelector("#updateCountry").value
    }
    console.log("this is edit address", editAddressData);
    axios.put('/customer-address',editAddressData)
    .then(()=> {
      console.log("edit from axios address");
    })
    .catch((error) => {
      console.log("error", error);
    })
  });
