require("dotenv").config({
  path: "../.env",
});
const database = require("../knexfile").development;
const knex = require("knex")(database);

class MerchantService {
  constructor(knex) {
    this.knex = knex;
  }

  // render product details
  // getAll() {
  //     return knex.select('*').from('product_info')
  //         .then((productData) => {
  //             console.log(productData);
  //             return productData;
  //         }).catch((error) => {
  //             console.log("error", error);
  //         })
  // }

  async getSoldProducts(merchant_id) {
    let purchases = await knex.select().from("purchases").where({
      merchant_id: merchant_id,
    });

    let purchaseInfo = {};
    let soldArr = [];
    // loop through purchases and look for item and which customer bought it;
    for (let eachItem of purchases) {
      // check what they bought
      let productBought = await knex.select().from("product_info").where({
        id: eachItem.product_info_id,
      });
      // console.log("what they bought?", productBought)

      // which customer bought it
      let customerInfo = await knex.select().from("customer").where({
        id: eachItem.customer_id,
      });
      // console.log("who bought it?", customerInfo)

      let customerDetail = await knex.select().from("customer_info")
        .where({
          id: eachItem.customer_id
        })

      // console.log("customerDetail", customerDetail)
      purchaseInfo = {
        id: eachItem.id,
        productName: productBought[0].productName,
        price: productBought[0].price,
        productCategory: productBought[0].productCategory,
        shippingPrice: productBought[0].shippingPrice,
        dataSold: eachItem.created_at,
        customerName: customerInfo[0].username,
        customerEmail: customerInfo[0].email,
        customerStreetName: customerDetail[0].street_address,
        customerBuilding: customerDetail[0].building_address,
        customerCountry: customerDetail[0].country_address
      }
      // console.log("this is purchaseInfo", purchaseInfo)
      soldArr.push(purchaseInfo);
    };
    return soldArr;
  }

  getIndividualProduct(id, merchant_id) {
    // get single product based on the shop's id
    return knex
      .select()
      .from("product_info")
      .where({
        id: id,
        merchant_id: merchant_id,
      })
      .then((item) => {
        // console.log(item);
        return item;
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  getMerchantProducts(id) {
    return knex
      .select("*")
      .from("merchant")
      .join("product_info", "merchant.id", "product_info.merchant_id")
      .where(`merchant.id`, id)
      .then((products) => {
        let displayProduct = products.map((product) => ({
          id: product.id,
          productPhoto: product.productPhoto[0],
          productName: product.productName,
          price: product.price,
          shippingPrice: product.shippingPrice,
          Size: product.Size,
          stock: product.stock,
          productCondtion: product.productCondition,
          productCategory: product.productCategory,
          productDescription: product.productDescription,
        }));
        // console.log("display product!!!!", products)
        return displayProduct;
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  getMerchantInfo(id) {
    return knex
      .select("*")
      .from("merchant")
      .join("merchant_info", "merchant.id", "merchant_info.merchant_id")
      .where(`merchant.id`, id)
      .then((merchantInfo) => {
        let merchant_Information = merchantInfo.map((info) => ({
          merchantName: info.merchantName,
          profilePic: info.profilePic,
          shopDescription: info.shopDescription,
          socialHandle: info.socialHandle,
        }));
        return merchant_Information;
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  createProduct(
    productPhoto,
    productName,
    productDescription,
    stock,
    price,
    shippingPrice,
    Size,
    productCondtion,
    productCategory,
    productStatus,
    merchant_id
  ) {
    return (
      knex("product_info")
      .max("id")
      .then((maxId) => {
        // console.log("Max product ID", maxId)
        let currentMax = parseInt(maxId[0].max);
        // let currentMax = 1;
        return currentMax;
      })
      .then((currentMax) => {
        let newId = currentMax + 1;
        let newProduct = {
          id: newId,
          productPhoto: JSON.stringify(productPhoto),
          productName: productName,
          productDescription: productDescription,
          stock: stock,
          price: price,
          shippingPrice: shippingPrice,
          Size: Size,
          productCondition: productCondtion,
          productCategory: productCategory,
          productStatus: productStatus,
          merchant_id: merchant_id,
        };
        // console.log("new product", newProduct)
        return knex("product_info").insert(newProduct);
      })
      // .then(() => {
      //   console.log("inserted");
      // })
      .catch((error) => {
        console.log(error, "error creating new product");
      })
    );
  }
  //************************works for one user*************************** */
  // getMerchantInfoSettings(id) {
  //   return knex.select("*").from("merchant").join("merchant_info", "merchant.id", "merchant_info.merchant_id")
  //     .where(`merchant.id`, id)
  //     .then((merchantInfo) => {
  //     //  console.log("ijadfsajfdbsagfdadas", merchantInfo)
  //       let merchant_Information = {
  //         merchantName: merchantInfo[0].merchantName,
  //         profilePic: merchantInfo[0].profilePic,
  //         shopDescription: merchantInfo[0].shopDescription,
  //         socialHandle: merchantInfo[0].socialHandle
  //       }
  //       // console.log(merchant_Information)
  //       return merchant_Information;
  //     }).catch((error) => {
  //       console.log(error, "error")
  //     })
  // }
  //***********************test****************************8 */
  getMerchantInfoSettings(id) {
    return knex
      .select("*")
      .from("merchant")
      .join("merchant_info", "merchant.id", "merchant_info.merchant_id")
      .where(`merchant.id`, id)
      .then((merchantInfo) => {
        // console.log("ijadfsajfdbsagfdadas", merchantInfo);
        let merchant_Information = {
          merchantName: merchantInfo[0].merchantName,
          profilePic: merchantInfo[0].profilePic,
          shopDescription: merchantInfo[0].shopDescription,
          socialHandle: merchantInfo[0].socialHandle,
        };
        // console.log(merchant_Information);
        return merchant_Information;
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
  // ********************************************************

  createProduct(
    productPhoto,
    productName,
    productDescription,
    stock,
    price,
    shippingPrice,
    Size,
    productCondition,
    productCategory,
    productStatus,
    merchant_id
  ) {
    return (
      knex("product_info")
      .max("id")
      .then((maxId) => {
        // console.log("Max product ID", maxId);
        let currentMax;
        if (maxId[0].max) {
          currentMax = parseInt(maxId[0].max);
        } else {
          currentMax = 1;
        }
        return currentMax;
      })
      .then((currentMax) => {
        let newId = currentMax + 1;
        let newProduct = {
          id: newId,
          productPhoto: JSON.stringify(productPhoto),
          productName: productName,
          productDescription: productDescription,
          stock: stock,
          price: price,
          shippingPrice: shippingPrice,
          Size: Size,
          productCondition: productCondition,
          productCategory: productCategory,
          productStatus: productStatus,
          merchant_id: merchant_id,
        };
        // console.log("new product", newProduct)
        return knex("product_info").insert(newProduct);
      })
      // .then(() => {
      //   console.log("inserted");
      // })
      .catch((error) => {
        console.log(error, "error creating new product");
      })
    );
  }

  deleteProduct(id) {
    // console.log("Deleting product");
    return (
      knex("product_info")
      .where({
        id: id,
      })
      .del()
      // .then(() => {
      //   console.log("deleted from backend");
      // })
      .catch((error) => {
        console.log("error", error);
      })
    );
  }

  // ***************10/06*********************
  editMerchantDes(merchantId, newShopDescription) {
    return this.knex("merchant_info")
      .select("*")
      .where({
        merchant_id: merchantId,
      })
      .update({
        shopDescription: newShopDescription,
      })
      .then(() => {
        // console.log("updated merchant text area");
        return "done";
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
  editMerchantUsername(merchantId, newMerchantName) {
    return this.knex("merchant")
      .select("*")
      .where({
        id: merchantId,
      })
      .update({
        merchantName: newMerchantName,
      })
      .then(() => {
        // console.log("done");
        return "done";
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
  //************************************** */
  postMerchantImage(merchant_id, shopPictureURL) {
    return (
      this.knex("merchant_info")
      .update("profilePic", shopPictureURL)
      .where({
        merchant_id: merchant_id,
      })
      // .then((data, dataSite) => {
      //   console.log("added shop pic", data, dataSite);
      // })
      .catch((err) => {
        console.log("err", err);
      })
    );
  }

  //******************************************** */
  deleteProduct(id) {
    // console.log("Deleting product");
    return knex("product_info")
      .where({
        id: id,
      })
      .del()
      .then(() => {
        console.log("deleted item");
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  updateProduct(
    id,
    productPhoto,
    productName,
    productDescription,
    stock,
    price,
    shippingPrice,
    Size,
    productCondition,
    productCategory,
    productStatus
  ) {
    // console.log("updating product");
    return (
      knex("product_info")
      .where({
        id: id,
      })
      .update({
        productPhoto: JSON.stringify(productPhoto),
        productName: productName,
        productDescription: productDescription,
        stock: stock,
        price: price,
        shippingPrice: shippingPrice,
        Size: Size,
        productCondition: productCondition,
        productCategory: productCategory,
        productStatus: productStatus,
      })
      // .then(() => {
      //   console.log("Updated product");
      // })
      .catch((error) => {
        console.log(error, "Cant update product");
      })
    );
  }
}

// let test = new MerchantService(knex);
// test.getMerchantInfo(1);

module.exports = MerchantService;

// let test = new MerchantService();
// test.getSoldProducts(2)
// test.getIndividualProduct(3, 2)
// test.getMerchantInfo(1)
// // // test.getAll()
// test.createProduct('https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'new top', 'new top from hk', '1', '48', '10', 'M', 'Brand New', 'Top', 'unsold', '1')
// // test.deleteProduct(3)
// test.updateProduct(6,'', 'Testing on99', 'testing', '1', '2000', '100', 'L', 'Used', 'Shoes', 'unsold')
// test.getMerchantProducts(1)