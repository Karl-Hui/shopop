require("dotenv").config({
    path: "../.env"
});
const database = require("../knexfile").development;
const knex = require("knex")(database);

class MerchantService {
    constructor(knex) {
        this.knex = knex;
    }

    // render product details
    getAll() {
        return knex.select('*').from('product_info')
            .then((productData) => {
                console.log(productData);
                return productData;
            }).catch((error) => {
                console.log("error", error);
            })
    }

    getIndividualProduct(id, merchant_id) {
        // get single product based on the shop's id
        return knex.select().from("product_info")
            .where({
                id: id,
                merchant_id: merchant_id
            }).then((item) => {
                console.log(item)
                return item;
            }).catch((error) => {
                console.log(error, "error")
            })
    }

    getMerchantProducts(id) {
        return knex.select("*").from("merchant").join("product_info", "merchant.id", "product_info.merchant_id")
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
                console.log("display product!!!!", products)
                return displayProduct;
            }).catch((error) => {
                console.log(error, "error")
            })
    }


    // Get all merchant information

    getMerchantInfo(id) {
        return knex.select("*").from("merchant").join("merchant_info", "merchant.id", "merchant_info.merchant_id")
            .where(`merchant.id`, id)
            .then((merchantInfo) => {
                let merchant_Information = merchantInfo.map((info) => ({
                    merchantName: info.merchantName,
                    profilePic: info.profilePic,
                    shopDescription: info.shopDescription,
                    socialHandle: info.socialHandle
                }));
                // console.log(merchant_Information)
                return merchant_Information;
            }).catch((error) => {
                console.log(error, "error")
            })
    }

    createProduct(productPhoto, productName, productDescription, stock, price, shippingPrice, Size, productCondtion, productCategory, productStatus, merchant_id) {
        return knex("product_info")
            .max('id')
            .then((maxId) => {
                // console.log("Max product ID", maxId)
                let currentMax = parseInt(maxId[0].max)
                // let currentMax = 1
                return currentMax;
            }).then((currentMax) => {
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
                    merchant_id: merchant_id
                }
                // console.log("new product", newProduct)
                return knex('product_info').insert(newProduct)
            }).then(() => {
                console.log('inserted')
            }).catch((error) => {
                console.log(error, "error creating new product")
            })
    }

    deleteProduct(id) {
        console.log("Deleting product")
        return knex("product_info")
            .where({
                id: id
            })
            .del()
            .then(() => {
                console.log("deleted item")
            }).catch((error) => {
                console.log('error', error)
            })
    }

    updateProduct(id, productPhoto, productName, productDescription, stock, price, shippingPrice, Size, productCondtion, productCategory, productStatus) {
        console.log("updating product")
        return knex("product_info")
            .where({
                id: id
            })
            .update({
                productPhoto: productPhoto,
                productName: productName,
                productDescription: productDescription,
                stock: stock,
                price: price,
                shippingPrice: shippingPrice,
                Size: Size,
                productCondition: productCondtion,
                productCategory: productCategory,
                productStatus: productStatus
            }).then(() => {
                console.log("Updated product")
            }).catch((error) => {
                console.log(error, "Cant update product")
            })
    }
//merchant settings
editMerchantUsername(merchantId,newMerchantName){
    return this.knex("merchant")
    .select()
    .where({id: merchantId})
    .update({merchantName:newMerchantName})
}

// editMerchantAddress(merchantId, newMerchantAddress){
//     return this,knex("merchant")
// }


}

module.exports = MerchantService;

// let test = new MerchantService
// test.getIndividualProduct(3, 2)
// test.getMerchantInfo(1)
// // // test.getAll()
// test.createProduct('https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=649&q=80','new top', 'new top from hk', '1', '48', '10', 'M', 'Brand New', 'Top', 'unsold', '1')
// // test.deleteProduct(3)
// test.updateProduct(4, 'https://images.unsplash.com/photo-1497339100210-9e87df79c218?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80','Blazer', 'new blazer 9/10 condition', '1', '120', '10', 'L', 'Used', 'Top', 'unsold')
// test.getMerchantProducts(1)
