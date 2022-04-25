const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const today = require("../utils/date-time")

// converts date to YYYY-MM-DD format
function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
};

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  let dateFromQuery = req.query;
  // backup, defaults dateFromQuery to today,
  if (!dateFromQuery) {
    dateFromQuery = today();
  };
  // console.log(`dateFromQuery`, dateFromQuery);

  let newDate = [];
  for (const index in dateFromQuery) {
    newDate.push(dateFromQuery[index]);
  }
  const formattedDate = newDate.join("");
  // console.log("Formatted Date:", formattedDate)

  const data = await service.list();
  // console.log("All reservations:", data);
  
  const resForCurrentDate = data.filter((res) => {
    let resDateAsString = asDateString(new Date(res.reservation_date))
    // if reservation date matches date from query, push into resForCurrentDate array
    if (resDateAsString === formattedDate) {
      // console.log(res)
      return res
    }
  });

  // if (resForCurrentDate) {console.log(`resForCurrentDate`, resForCurrentDate)}

  const sortedReservations = resForCurrentDate.sort((a, b) => a.reservation_time.replace(/\D/g, '') - b.reservation_time.replace(/\D/g, '') )

  res.json({data: sortedReservations});
};

async function listAll(req, res) {
  const data = await service.list();
  res.json({data: data})
};

// validates input string follows YYYY-MM-DD format
function dateIsValid(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateStr.match(regex) === null) {
    return false;
  }

  const date = new Date(dateStr);

  const timestamp = date.getTime();

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false;
  }

  return date.toISOString().startsWith(dateStr);
};

// validates input time follows HH-MM format
function validateHhMm(inputField) {
  var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField);
  return isValid;
};

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const d = data.reservation_date;
  // res date values
  const resDateFormatted = new Date(d);
  const reserveDate = new Date(data.reservation_date);
  const resMonth = Number(d.slice(5, 7));
  const resDay = Number(d.slice(8, 10));
  const resYear = Number(d.slice(0, 4));

  // current date values
  const today = new Date();
  const year = today.getFullYear();
  const mes = today.getMonth()+1;
  const dia = today.getDate();
  const hours = today.getHours();

  // check what day Mon - Sun, 0 - 6
  const dateValue = resDateFormatted.getDay();  
  
  const resDate = data.reservation_date;
  const resPeople = data.people;
  const resTime = data.reservation_time;

  // format validations
  // const dateFormat = 'YYYY-MM-DD';
  // if resdate is not in format, return next({ status: 400, message: "Input is not a valid date"})
  // if resTime is not in format, return next({ status: 400, message: "Input is not a valid time"})
  if (!dateIsValid(resDate)) return next({ status: 400, message: `${resDate} is not a valid input for reservation_date`})
  if (typeof(resPeople) !== "number") return next({ status: 400, message: `${resPeople} is not a valid input for people`})
  if (!validateHhMm(resTime)) return next({ status: 400, message: `${resTime} is not a valid input for reservation_time`})

  // reservation date on tuesday validation
  if (dateValue === 1) return next({ status: 400, message: `Restaurant is closed on Tuesdays ${resDate}`})

  // reservation date values validations
  if (
    resYear < year 
    || (resMonth === mes && resDay < dia) 
    || (resYear === year && resMonth < mes )
    || (resDay === dia && resMonth === mes && resYear === year && hours > resTime ) ) {
      return next({ status: 400, message: `reservation_date must be in the future ${resDate}`})
    };


  next();
};

const hasReqProps = hasProperties(
"first_name",
"last_name",
"mobile_number",
"reservation_date",
"reservation_time",
"people");

async function create(req, res, next) {
  const newReservation = {
    ...req.body.data
  };
  console.log("New Reservation data:", newReservation)
  if (newReservation.status === "seated" || newReservation.status === "finished") {
    return next ({ status: 400, message: `Reservation status: ${newReservation.status} is invalid` })
  };
  const data = await service.create(newReservation);
    res.status(201).json({ data: data })
};

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  console.log("resId", reservationId)
  const data = await service.read(reservationId);

  if (data) {
    // console.log("Found reservation:", data)
    res.locals.reservation = data;
    return next();
  } else {
    return next({ status: 404, message: `Reservation with reservation_id: ${reservationId} does not exist`})
  }
}

async function read(req, res, next) {
  // const { reservationId } = req.params;
  // // console.log("Res Id:", reservationId);

  // const data = await service.read(reservationId);

  const data = res.locals.reservation;

  res.status(200).json({ data: data })
}

// function to update a reservations status from "booked" to "seated"
async function updateStatus(req, res, next) {
  const resWithUpdatedStatus = res.locals.reservation;
  console.log("reservation to edit:", resWithUpdatedStatus)
  console.log("req.body:", req.body.data.status);
  if (req.body.data.status === "cancelled") {
    // console.log("req.body", req.body.data.status);
    resWithUpdatedStatus.status = "cancelled"
  }
  // if status is booked, set new res status to seated. else set to finished
  else if (resWithUpdatedStatus.status === "seated") {
    resWithUpdatedStatus.status = "finished"
  } else {
    resWithUpdatedStatus.status = "seated"
  }

  console.log("newResWithUpdatedStatus", resWithUpdatedStatus)

  const data = await service.updateStatus(resWithUpdatedStatus);
  console.log("updateStatus, updated seated reservation", data)
  res.status(201).json({ data: data })
};

async function editReservation(req, res, next) {
  const currentReservation = res.locals.reservation;
  const newRes = {
    ...req.body.data,
    reservation_id: currentReservation.reservation_id
  };

  console.log("New reservation data:", newRes)
  const data = await service.editReservation(newRes);

  res.status(201).json({ data: data.status })
};

module.exports = {
  list,
  listAll,
  create: [ asyncErrorBoundary(hasReqProps), asyncErrorBoundary(hasOnlyValidProperties), asyncErrorBoundary(create) ],
  read: [ asyncErrorBoundary(reservationExists), asyncErrorBoundary(read) ],
  updateStatus: [ asyncErrorBoundary(reservationExists), asyncErrorBoundary(updateStatus) ],
  editReservation: [ asyncErrorBoundary(reservationExists), asyncErrorBoundary(editReservation) ]
};
