const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

async function list(req, res) {
    const data = await service.list();
    res.json({ data: {} })
};



async function create(req, res, next) {
    const newTable = {
        ...req.body.data
    }

    const data = await service.create(newTable);

    res.status(201).json({ data: data });
};

module.exports = {
    list,
    create: [ asyncErrorBoundary(hasReqProps), asyncErrorBoundary(hasOnlyValidProperties), asyncErrorBoundary(create) ]
  };
  