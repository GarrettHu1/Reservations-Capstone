const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const reservationsController = require("../reservations/reservations.controller");

async function list(req, res) {
    const data = await service.list();
    console.log("Data:", data);
    // const sortedData = data.sort((a, b) => a.table_name.replace(/[^A-Z0-9]/ig, "_") - b.table_name.replace(/[^A-Z0-9]/ig, "_") );
    const sortedData = data.sort(function(a, b) {
        return /[A-Za-z]/.test(a.table_name) - /[A-Za-z]/.test(b.table_name) || a.table_name.charCodeAt(0) - b.table_name.charCodeAt(0)
      });
    console.log("Sorted Data:", sortedData);
    res.json({ data: sortedData });
};

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
    const a = data.table_name;
    const b = data.capacity;
    const c = data.reservation_id;
    console.log("table data:", b);

    // input validations
    if (a.length <= 1) {
        return next({ status: 400, message: `table_name is not valid`});
    };
    if (typeof(b) !== "number") {
        return next({ status: 400, message: `capacity must be a number`});
    };    
    if (b.length < 1 || b < 1) {
        return next({ status: 400, message: `Table must seat at least 1 person`});
    };


    next();
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
    console.log("newTable:", newTable)
    const data = await service.create(newTable);
    res.status(201).json({ data: data });
};

async function update(req, res, next) {
    // obj containing id of reservation being seated, and of table 
    const values = {
        ...req.body.data
    };

    // reservation to be seated
    // const reservation = values.reservations.find((reservation) => Number(reservation.reservation_id) === Number(values.reservation_id));
    // reservation from database
    const reservation = values.reservations
    // console.log("values reservations:", values.reservations)

    // if could not find reservation return error
    if (!reservation) return next({ status: 400, message: `Did not find reservation ${reservation}`});    
    // reservation_id validation
    // if (!reservation.reservation_id) {
    //     return next({ status: 400, message: `Reservation id is missing. Received: ${values.reservation_id}` });
    // };


    const tableFromId = await service.read(values.table_id);
    // console.log("tableFromId:", tableFromId);

    const updatedTable = {
        ...tableFromId,
        reservation_id: values.reservation_id
    }
    // console.log(updatedTable);



    // if number of people in reservation > table/s capacity, return error
    if (Number(reservation.people) > Number(updatedTable.capacity)) {
        return next({
            status: 400, 
            message: `Table does not have enough capacity. Seating for ${reservation.people} is needed.`
        });
    };

    const newTable = await service.update(updatedTable);
    console.log("Updated table:", data);

    res.status(201).json({ data: newTable });
};

module.exports = {
    list,
    create: [ asyncErrorBoundary(hasReqTableProps), asyncErrorBoundary(hasOnlyValidProperties), asyncErrorBoundary(create) ],
    update: [  asyncErrorBoundary(update) ]
  };
  