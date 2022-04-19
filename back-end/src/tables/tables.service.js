const knex = require("../db/connection");

function list() {
    return knex("tables").select("*");
}

function create(newTable) {
    return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((newRes) => newRes[0])
}

module.exports = {
    list,
    create
};