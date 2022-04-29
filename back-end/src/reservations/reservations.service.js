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
    .then(([res]) => res );
};

function update(updatedReservation) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id})
    .update(updatedReservation, "*")
    .then(([res]) => res );
};

module.exports = {
    list,
    create,
    read,
    updateStatus,
    update
};