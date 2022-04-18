const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// converts date to YYYY-MM-DD format
function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  // lists all reservations for a day (from query)
  const resForDate = [];
  const currentDay = req.query.date;
  const data = await service.list();
  console.log(data);
  
  data.filter((res) => {
    let date = res.reservation_date;
    let formattedDate = new Date(date);
    let asString = asDateString(formattedDate);
    // console.log(asString)
    // console.log("formatted:", asString, "Current day:", currentDay)
    // console.log(asString === currentDay)
    // pushes reservation where date is equal to date from query
    if (asString === currentDay) resForDate.push(res)
  });
  // console.log(resForDate);
  const sorted = resForDate.sort((a, b) => a.reservation_time.replace(/\D/g, '') - b.reservation_time.replace(/\D/g, '') )
  // console.log("sorted array:", sorted);
  
  res.json({data: sorted});
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

  const resDate = data.reservation_date;
  const resPeople = data.people;
  console.log(resPeople)
  console.log(typeof(resPeople))
  const resTime = data.reservation_time;

  // const dateFormat = 'YYYY-MM-DD';
  // if resdate is not in format, return next({ status: 400, message: "Input is not a valid date"})
  // if resTime is not in format, return next({ status: 400, message: "Input is not a valid time"})

  if (!dateIsValid(resDate)) return next({ status: 400, message: `${resDate} is not a valid input for reservation_date`})
  if (typeof(resPeople) !== "number") return next({ status: 400, message: `${resPeople} is not a valid input for people`})
  if (!validateHhMm(resTime)) return next({ status: 400, message: `${resTime} is not a valid input for reservation_time`})

  next();
}

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

  const data = await service.create(newReservation);
  res.status(201).json({ data: data })
};

module.exports = {
  list,
  listAll,
  create: [ asyncErrorBoundary(hasReqProps), asyncErrorBoundary(hasOnlyValidProperties), asyncErrorBoundary(create) ]
};
