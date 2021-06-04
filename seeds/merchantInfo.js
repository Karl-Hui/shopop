exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('merchant_info').del()
    .then(function () {
      // Inserts seed entries
      return knex('merchant_info').insert([{
        profilePic: "https://d2h1pu99sxkfvn.cloudfront.net/b0/2606444/1014139650_6b753a2592c84555bb4d1852025bf31c/U1.jpg",
        shopDescription: '✔️Worldwide shipping ✔️FREE UK',
        socialMediaURL: "https://www.instagram.com/kentarovintage/",
        merchant_id: 1
      }]);
    });
};