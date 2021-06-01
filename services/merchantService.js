require("dotenv").config({ path: "../.env" });
const database = require("../knexfile").development;
const knex = require("knex")(database);


class MerchantService {
    constructor(knex){
        this.knex = knex;
    }
getAll(){
    return knex.select('*').from('customer')
    .then((data) => {
        console.log(data)
    })
}
getMerchantInfo(merchantId){
    return knex("merchant")
    .select()
    .where({
        id: merchantId
    })
    .then((data) =>{
    console.log("this is merchant data:", data[0])
    return data[0].merchantName
    })
    .catch((error) => {
    console.log("error", error);
    })
}

}

module.exports = MerchantService

// let test = new MerchantService
// test.getMerchantInfo(1)
// test.getAll()