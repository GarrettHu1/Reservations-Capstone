const knex = require("../db/connection");

function list() {
    return knex("tables").select("*");
};

function create(newTable) {
    return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((newRes) => newRes[0]);
};

function read(table_id) {
    return knex("tables")
    .select("*")
    .where({ table_id })
    .first();
};

function update(updatedTable) {
    return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
};

function destroy(updatedTable) {
    return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
};

module.exports = {
    list,
    create,
    read,
    update,
    delete: destroy
};