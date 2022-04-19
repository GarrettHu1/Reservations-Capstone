const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

async function list(req, res) {
    const data = await service.list();
    const sortedData = data.sort((a, b) => a.table_name - b.table_name);
    res.json({ data: sortedData });
};

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
    const b = data.capacity;
  
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

module.exports = {
    list,
    create: [ asyncErrorBoundary(hasReqProps), asyncErrorBoundary(hasOnlyValidProperties), asyncErrorBoundary(create) ]
  };
  