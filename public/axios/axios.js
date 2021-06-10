// console.log("linked to script axios ADOFHA;KDSJFHSA;JDFH;ASHDF;AHFD;OAHDF;KAHSDF;LKAHSFD;LKAHSDLKFAHDLKFAHFLKAHS;LKDF");
//button to update username
let editbtn = document.querySelector("#updateUser")

editbtn.addEventListener('click',() => {
    console.log("hello you clicked me")
    let edit = {
        username:document.querySelector("#username").value
    }
    axios.put('/customer-settings',edit)
    .then((data)=> {
        console.log("this is edit", data);
        // window.location.reload();
        document.querySelector("#username-words").innerHTML=data.data
        // console.log("edit from axios username")
    })
    .catch((error)=> {
        console.log("error", error);
    })
});

//button to update customer address
let editbtnAddress = document.querySelector("#updateAddress")

editbtnAddress.addEventListener('click',() => {
    console.log("hello you clicked me Address")
    let editAddressData = {
        buildingAddress:document.querySelector("#updateBuilding").value,
        streetAddress:document.querySelector("#updateStreet").value,
        countryAddress:document.querySelector("#updateCountry").value
    }
    // console.log("this is edit address", editAddressData);
    axios.put('/customer-setting',editAddressData)
    .then((data)=> {
       console.log("this is address hello",data.data);
       document.querySelector("#customerAddressB-words").innerHTML=data.data.building_address,
       document.querySelector("#customerAddressSA-words").innerHTML=data.data.street_address,
        document.querySelector("#customerAddressC-words").innerHTML=data.data.country_address
    //   console.log("edit from axios address");
    })
    .catch((error) => {
      console.log("error", error);
    })
  });

