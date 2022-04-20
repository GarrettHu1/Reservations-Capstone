const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

async function list(req, res) {
    const data = await service.list();
    console.log("Data:", data);
    const sortedData = data.sort((a, b) => a.table_name - b.table_name);
    console.log("Sorted Data:", sortedData);
    res.json({ data: sortedData });
};

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
    const b = data.capacity;
    const c = data.reservation_id;
  
    if (b < 1) {
        return next({ status: 400, message: `Table must seat at least 1 person`});
    };

    return next();
  };

const hasReqProps = hasProperties(
    "table_name",
    "capacity"
);

async function create(req, res, next) {
    const newTable = {
        ...req.body.data
    };
    const data = await service.create(newTable);
    res.status(201).json({ data: data });
};

async function update(req, res, next) {
    const newTable = {
        ...req.body.data
    }
    console.log(newTable);
    console.log("newTable:", newTable);
    console.log("reservation_id", newTable.reservation_id);
    console.log("table_id", newTable.table_id);
    const tableFromId = await service.read(newTable.table_id);
    console.log("tableFromId:", tableFromId);

    const updatedTable = {
        ...tableFromId,
        reservation_id: newTable.reservation_id
    }
    console.log(updatedTable);

    const data = await service.update(updatedTable);
    console.log("Updated table:", data);

    res.status(201).json({ data: updatedTable });
}

module.exports = {
    list,
    create: [ asyncErrorBoundary(hasReqProps), asyncErrorBoundary(hasOnlyValidProperties), asyncErrorBoundary(create) ],
    update: [  asyncErrorBoundary(update) ]
  };
  