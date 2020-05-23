const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {

  await knex("users").insert([
    {name: "abc", email:"abc@gmail.com", password: await bcrypt.hashSync("123", 8)},
    {name: "Tanveer Saleem", email:"tanveer@gmail.com", password: await bcrypt.hashSync("123", 8)},
    {name: "Atif", email:"atif@gmail.com", password: await bcrypt.hashSync("123", 8)}
  ])
  
};
