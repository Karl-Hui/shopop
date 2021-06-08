require("dotenv").config({ path: "../.env" });
const database = require("../knexfile").development;
const knex = require("knex")(database);

class CustomerServices {
  constructor(knex) {
    this.knex = knex;
  }

  // getCustomerName(customerId) {
  //   return this.knex("customer")
  //     .select()
  //     .where({ id: customerId })
  //     .then((data) => {
  //       console.log("this is customer data:", data[0].username);
  //       return data[0].username;
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // }

  getCustomerInfo(customerId) {
    return this.knex("customer_info")
      .select()
      .where({ customer_id: customerId })
      .then((data) => {
        console.log("This data belongs to customer:", data);
        return data;
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  getAllCustomerInfo(customerId) {
    return this.knex("customer")
      .join("customer_info", "customer.id", "customer_id")
      .select()
      .where({ customer_id: customerId })
      .then((data) => {
        // console.log("customerInfo here blach", data);
        return data[0];
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
  editCustomerUsername(customerId,newUsername){
    return this.knex("customer")
    .select()
      .where({ id: customerId })
    .update({username: newUsername})
    // .then(()=> {
    //   // console.log("updated username");
    // })
    // .catch((error) => {
    //   console.log("error", error);
    // })
    
  }
  editCustomerAddress(customerId,newBuildingAddress,newStreetAddress,newCountryAddress){
    return this.knex("customer_info")
    .select()
      .where({customer_id: customerId })
    .update({building_address: newBuildingAddress,
             street_address: newStreetAddress,
             country_address: newCountryAddress
            })
    .then(()=> {
      console.log("updated address");
    })
    .catch((error) => {
      console.log("error", error);
    })
  }

  postImage(user_id, imageURL) {

    return knex("customer_info")
      .update("profilePicture", imageURL)
      .where({ customer_id: user_id })
      .then(() => {
        console.log("added profile Pic!");
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  getCart(user_id) {
    return knex
      .from("product_info")
      .innerJoin(
        "checkout_cart",
        "checkout_cart.product_info_id",
        "product_info.id"
      )
      .select()
      .where({ customer_info: user_id })
      .then((data) => {
        console.log("the getCart", data);
        return data;
      });
    // knex("checkout_cart")
    //   .where({ customer_info: user_id })
    //   .then((data) => {
    //     console.log("the getCart", data);
    //   }); 
  }

//run this to get all products
  getMerchantProducts(category) {
    return this.knex("product_info")
    .select("*")
    .table('product_info')
    .then((productData)=> {
      console.log("data from products table:", productData)
      return productData
    })
    .catch((error)=> {
      console.log("error", error)
    });
  }

  // getMerchantProducts(category) {
  //   return this.knex("product_info")
  //   .select("*")
  //   .table('product_info')
  //   .then((productData)=> {
  //     console.log(productData)
      
  //     return productData
  //   })
  //   .catch((error)=> {
  //     console.log("error", error)
  //   });
  // }
  //else then run this depending of filter selection
  
  getSelectedMerhcantProduct(category){
    return this.knex("product_info")
    .select("*")
    .where('productCategory', category)
    .then((data)=> {
      console.log(data[1]['productCategory'])
      return data
    })
  }
}
// test
// let service = new CustomerServices(knex);
// service.getMerchantProducts("Top");
// console.log("got the data from the database");


module.exports = CustomerServices;
