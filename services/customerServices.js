require("dotenv").config();
const database = require("../knexfile").development;
const knex = require("knex")(database);

class customerServices {
  constructor(knex) {
    this.knex = knex;
  }
}
