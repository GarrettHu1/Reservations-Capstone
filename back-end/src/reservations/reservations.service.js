const knex = require("../db/connection");

function list() {
    return knex("reservations").select("*");
};

function create(newReservation) {
    return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((newRes) => newRes[0])
};

function read(reservationId) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first()
};

function updateStatus(resWithUpdatedStatus) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: resWithUpdatedStatus.reservation_id})
    .update(resWithUpdatedStatus, "*")
};

function editReservation(newRes) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: newRes.reservation_id})
    .update(newRes, "*")
};

module.exports = {
    list,
    create,
    read,
    updateStatus,
    editReservation
};