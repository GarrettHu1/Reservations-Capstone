const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const controller = require("../reservations/reservations.controller");

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

  // newTable has required name and capacity props
const hasReqTableProps = hasProperties(
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
    // obj containing id of reservation being seated, and of table 
    const idValues = {
        ...req.body.data
    };

    // 

    const tableFromId = await service.read(idValues.table_id);
    // console.log("tableFromId:", tableFromId);

    const updatedTable = {
        ...tableFromId,
        reservation_id: idValues.reservation_id
    }
    console.log(updatedTable);

    const data = await service.update(updatedTable);
    console.log("Updated table:", data);

    res.status(201).json({ data: updatedTable });
};

module.exports = {
    list,
    create: [ asyncErrorBoundary(hasReqTableProps), asyncErrorBoundary(hasOnlyValidProperties), asyncErrorBoundary(create) ],
    update: [  asyncErrorBoundary(update) ]
  };
  