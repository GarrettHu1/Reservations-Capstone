const knex = require("../db/connection");

function list() {
    return knex("reservations").select("*");
}

function create(newReservation) {
    return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((newRes) => newRes[0])
}

module.exports = {
    list,
    create
};