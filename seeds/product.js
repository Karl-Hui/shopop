exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("product_info")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('product_info').insert([{
        productPhoto: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.sunspel.com%2Frow%2Fmens-short-sleeve-crew-neck-t-shirt-black.html&psig=AOvVaw3gxnPJtpjr3rOQGygprNlj&ust=1622774350719000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKDRqte3-vACFQAAAAAdAAAAABAE',
        productName: 'Tshirt',
        productDescription: 'just a tshirt',
        stock: '1',
        price: '40',
        shippingPrice: '5',
        Size: 'L',
        productCondition: 'used',
        productCategory: 'Top',
        productStatus: 'unsold',
        merchant_id: 1
      }]);
    });
};