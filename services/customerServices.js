require("dotenv").config({
  path: "../.env",
});
const database = require("../knexfile").development;
const knex = require("knex")(database);

class CustomerServices {
  constructor(knex) {
    this.knex = knex;
  }

  getCustomerInfo(customerId) {
    return this.knex("customer_info")
      .select()
      .where({
        customer_id: customerId,
      })
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
      .where({
        customer_id: customerId,
      })
      .then((data) => {
        // console.log("customerInfo here blach", data);
        return data[0];
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
  editCustomerUsername(customerId, newUsername) {
    return this.knex("customer")
      .select()
      .where({
        id: customerId,
      })
      .update({
        username: newUsername,
      })
      .then(() => {
        return newUsername;
      })
      .catch((err) => {
        console.log("err", err);
      });
    // .then(()=> {
    //   // console.log("updated username");
    // })
    // .catch((error) => {
    //   console.log("error", error);
    // })
  }
  editCustomerAddress(
    customerId,
    newBuildingAddress,
    newStreetAddress,
    newCountryAddress
  ) {
    return this.knex("customer_info")
      .select()
      .where({
        customer_id: customerId,
      })
      .update({
        building_address: newBuildingAddress,
        street_address: newStreetAddress,
        country_address: newCountryAddress,
      })
      .then(() => {
        console.log("updated address");
        let data = {
          building_address: newBuildingAddress,
          street_address: newStreetAddress,
          country_address: newCountryAddress,
        };
        return data;
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  postImage(user_id, imageURL) {
    return this.knex("customer_info")
      .update("profilePicture", imageURL)
      .where({
        customer_id: user_id,
      })
      .then((data, dataInfo) => {
        console.log("added profile Pic!", data, dataInfo);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  getCart(user_id) {
    return this.knex
      .from("product_info")
      .innerJoin(
        "checkout_cart",
        "checkout_cart.product_info_id",
        "product_info.id"
      )
      .select()
      .where({
        customer_info: user_id,
      })
      .then((data) => {
        console.log("the getCart", data);
        return data;
      })
      .catch((err) => {
        console.log("err", err);
      });
    // knex("checkout_cart")
    //   .where({ customer_info: user_id })
    //   .then((data) => {
    //     console.log("the getCart", data);
    //   });
  }

  //run this to get all products
  // getMerchantProducts(category) {
  //   return this.knex("product_info")
  //     .select("*")
  //     .table("product_info")
  //     .orderBy("id", "desc")
  //     .then((productData) => {
  //       // console.log("data from products table:", productData);
  //       return productData;
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // }

  // getMerchantProducts(category) {
  //   return this.knex("product_info")
  //     .select("*")
  //     .table("product_info")
  //     .then((productData) => {
  //       // console.log("data from products table:", productData);
  //       return productData;
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // }

  getIndividualProduct(id) {
    return this.knex("product_info")
      .select()
      .where({
        id: id,
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  gradAllCartByCustomerId(customer_id) {
    return this.knex("checkout_cart")
      .select()
      .where({
        customer_info: customer_id,
      })
      .orderBy("id")
      .then((data) => {
        // console.log("data", data);
        return data;
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  checkCartIsEmpty(data) {
    return new Promise((resolve, reject) => {
      if (data.length > 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    }).catch((err) => {
      console.log("err", err);
    });
  }

  getSelectedMerhcantProduct(category) {
    return this.knex("product_info")
      .select("*")
      .where("productCategory", category)
      .then((data) => {
        console.log(data[1]["productCategory"]);
        return data;
      });
  }

  getMerchantNameAndProducts() {
    return (
      this.knex("merchant")
        .join("product_info", "merchant.id", "merchant_id")
        .select("*")
        .orderBy("product_info.id", "desc")
        // .where({ customer_id: customerId })
        .then((data) => {
          console.log("merchant info and product!!!!!!", data);
          return data;
        })
        .catch((error) => {
          console.log("error", error);
        })
    );
  }

  checkMerchantIdInCart(inCart_product_info_id, add_product_info_id) {
    return this.knex("product_info")
      .where({
        id: inCart_product_info_id,
      })
      .then((inCart) => {
        const inCartId = inCart[0].merchant_id;
        return inCartId;
      })
      .then((inCartId) => {
        return this.knex("product_info")
          .where({
            id: add_product_info_id,
          })
          .then((addProduct) => {
            const addId = addProduct[0].merchant_id;
            console.log("inCartId", inCartId);
            console.log("addId", addId);
            return new Promise((resolve, reject) => {
              if (inCartId === addId) {
                resolve(true);
              } else {
                resolve(false);
              }
            }).then((data) => {
              console.log("id isSame?", data);
              return data;
            });
          });
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  checkProductId(product_id, customer_id) {
    let newProduct = {
      product_info_id: product_id,
      customer_info: customer_id,
      purchaseQuantity: 1,
    };
    return this.knex("checkout_cart")
      .select()
      .where({
        product_info_id: product_id,
        customer_info: customer_id,
      })
      .then((data) => {
        console.log("have item?", data);
        if (data.length > 0) {
          const quantity = data[0].purchaseQuantity + 1;
          return this.knex("checkout_cart")
            .update("purchaseQuantity", quantity)
            .where({
              customer_info: customer_id,
              product_info_id: product_id,
            });
        } else {
          return this.knex("checkout_cart")
            .insert(newProduct)
            .then(() => {
              console.log("added to cart yoyoyo");
            });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  addToCart(product_id, customer_id) {
    let newProduct = {
      product_info_id: product_id,
      customer_info: customer_id,
      purchaseQuantity: 1,
    };
    this.gradAllCartByCustomerId(customer_id)
      .then((allCartItems) => {
        this.checkCartIsEmpty(allCartItems).then((isEmpty) => {
          // check if item exist in check out cart
          if (isEmpty === true) {
            return this.knex("checkout_cart")
              .insert(newProduct)
              .then(() => {
                console.log("inserted");
              });
          } else {
            //check if the first in cart merchant id is same as new append merchant id
            this.checkMerchantIdInCart(
              allCartItems[0].product_info_id,
              product_id
            ).then((isSameMerchantId) => {
              if (isSameMerchantId === false) {
                return this.knex("checkout_cart")
                  .where({
                    customer_info: customer_id,
                  })
                  .del()
                  .then(() => {
                    console.log("add other merchant items");
                    return this.knex("checkout_cart").insert(newProduct);
                  });
              } else {
                this.checkProductId(product_id, customer_id).then(() => {
                  console.log("you did it!");
                });
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  async clearCart(customerId) {
    await knex("checkout_cart").del().where({
      customer_info: customerId,
    });
  }

  async simpleAddToCart(productId, quantity, customerId) {
    await knex("checkout_cart").insert({
      product_info_id: productId,
      purchaseQuantity: quantity,
      customer_info: customerId,
    });
  }

  //******************11/06******************** */
  //   SortProductPrice(price, compare) {
  //     return knex("product_info")
  //     .select("*")
  //     .where('price', compare, price)
  //     .then((data) =>{
  //       console.log(data)
  //     })
  //   }
}

// test
// let info = JSON.stringify("https://res.cloudinary.com/dnq92mpxr/image/upload/v1623124318/pq4olhcuhhgf2jjswzae.jpg")
// let service = new CustomerServices(knex);
// service.addToCart(10,2)
// service.SortProductPrice(50,'');
// console.log("got the data from the database");

module.exports = CustomerServices;
