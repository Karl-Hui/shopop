
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('merchant_info').del()
    .then(function () {
      // Inserts seed entries
      return knex('merchant_info').insert([
        {
          profilePic: "https://d2h1pu99sxkfvn.cloudfront.net/b0/2606444/1014139650_6b753a2592c84555bb4d1852025bf31c/U1.jpg", 
          shopDescription: '✔️Worldwide shipping ✔️FREE UK',
          socialMediaURL: "https://www.instagram.com/kentarovintage/",
          merchant_id: 2
        },
        {
          profilePic: "https://d2h1pu99sxkfvn.cloudfront.net/b0/2601374/712104193_cd3dde91a6494f259ce8b3cfce12269d/U1.jpg", 
          shopDescription: '♻️ Recycled up-cycled vintage finds 📮',
          socialMediaURL: "https://www.instagram.com/adorjan_uk",
          merchant_id: 1
        }
      ]);
    });
};
