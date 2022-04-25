const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const reservationsController = require("../reservations/reservations.controller");
const reservationsService = require("../reservations/reservations.service");
// const reservationExists = require("../reservations/reservations.controller");

async function list(req, res) {
    const data = await service.list();
    // console.log("Data:", data);
    // const sortedData = data.sort((a, b) => a.table_name.replace(/[^A-Z0-9]/ig, "_") - b.table_name.replace(/[^A-Z0-9]/ig, "_") );
    const sortedData = data.sort(function(a, b) {
        return /[A-Za-z]/.test(a.table_name) - /[A-Za-z]/.test(b.table_name) || a.table_name.charCodeAt(0) - b.table_name.charCodeAt(0)
      });
    // console.log("Sorted Data:", sortedData);
    res.json({ data: sortedData });
};

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
    const a = data.table_name;
    const b = data.capacity;
    const c = data.reservation_id;
    // console.log("table data:", b);

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
    // console.log("newTable:", newTable)
    const data = await service.create(newTable);
    res.status(201).json({ data: data });
};

// async function reservationExists(req, res, next) {
//     const { reservationId } = req.body.data;
//     // console.log("resId", reservationId)
//     const data = await reservationsService.read(reservationId);
  
//     if (data) {
//       // console.log("Found reservation:", data)
//       res.locals.reservation = data;
//       return next();
//     } else {
//       return next({ status: 404, message: `Reservation with reservation_id: ${reservationId} does not exist`})
//     }
//   }

async function update(req, res, next) {
    // obj containing id of reservation being seated, and of table , and reservations arr
    // contains table_id, reservation_id, reservations
    const values = req.body.data;
    console.log("Values:", values);
    
    if (!values) return next({ status: 400, message: "missing data"});
    
    const { reservation_id } = req.body.data;
    const { tableId } = req.params;

    // if reservation id undef or null => error
    if (!reservation_id) return next({ status: 400, message: `reservation_id missing, received: ${reservation_id}`});  

    const tableFromId = await service.read(values.table_id);

    // new table containing resId of res boing seated
    const updatedTable = {
        ...tableFromId,
        reservation_id: values.reservation_id
    }
    // console.log(updatedTable);

    const newTable = await service.update(updatedTable);
    // console.log("Updated table:", data);

    res.status(201).json({ data: newTable });
};

async function destroy(req, res, next) {
    // receives table_id, then removes/replaces res_id with null
    const { tableId } = req.params;

    const tableFromId = await service.read(tableId);

    if (!tableFromId) return next({ status: 404, message: `table_id ${tableId} does not exist`}); 

    if (!tableFromId.reservation_id) {
        return next({ status: 400, message: `table_id ${tableId} is not occupied`}); 
    };

    const updatedTable = {
        ...tableFromId,
        reservation_id: null
    }
    await service.delete(updatedTable);
    res.status(200).json({ data: updatedTable });
}

module.exports = {
    list,
    create: [ asyncErrorBoundary(hasReqTableProps), asyncErrorBoundary(hasOnlyValidProperties), asyncErrorBoundary(create) ],
    update: [ asyncErrorBoundary(update) ],
    delete: [ destroy ]
  };
  