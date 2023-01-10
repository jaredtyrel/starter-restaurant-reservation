const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties")

//  Validation Middleware

// validate reservation existence
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params || req.body.data
  const foundReservation = await service.read(reservation_id)
  if (foundReservation) {
    res.locals.reservation = foundReservation
    return next();
  }
  next({
    status: 404,
    message: `reservation with an ID of ${reservation_id} could not be found.`
  })
}

// validate time format
async function validateTime(req, res, next) {
  const { data = {} } = req.body;
  const time = data.reservation_time

  if (!time.match(/^\d{1,2}:\d{2}([ap]m)?$/)) {
    next({
      status: 400,
      message: "reservation_time must be a valid time format"
    })
  }
  if (time < "10:30" || time > "21:30") {
    next({
      status: 400,
      message: "reservation_time must be within business hours"
    })
  }

  next();
}

// validate date format
async function validateDate(req, res, next) {
  const { data = {} } = req.body;
  const date = new Date(data.reservation_date)
  const day = date.getUTCDay()
  const newDate = new Date()

  if (!Date.parse(date)) {
    next({
      status: 400,
      message: "reservation_date must be a valid date format!"
    })
  }
  if (day === 2) {
    return next({
      status: 400,
      message: `Restaurant closed on Tuesday, please choose a different day of the week.`
    })
  }
  if (
    JSON.stringify(date).slice(1, 11) < JSON.stringify(newDate).slice(1, 11) &&
    JSON.stringify(date).slice(12, 24) < JSON.stringify(newDate).slice(12, 24)
  ) {
    return next({
      status: 400,
      message: `Reservation must be a future date.`
    })
  }

  next();
}


// validate people is integer
function validatePeople(req, res, next) {
  const { data = {} } = req.body;

  if (!data.people || typeof data.people !== "number") {
    return next({ 
      status: 400, 
      message: `Invalid: people must be an integer greater than zero` 
    });
  }

  next();
}

// validate status is not seated
function checkCurrentStatus(req, res, next) {
  const { status } = req.body.data;

  if (status === "seated") {
    return next({ status: 400, message: `reservation is seated` });
  }

  if (status === "finished") {
    return next({ status: 400, message: `reservation is finished` });
  }

  next();
}
// validate form data submission 

// valid status list
const validStatus = ["booked", "finished", "seated", "cancelled"];
// check if the status submission is a valid status or unknown
function hasValidStatus(req, res, next) {
  const { status } = req.body.data;

  if (!validStatus.includes(status)) {
    return next({ 
      status: 400,
      message: "unknown status submission" 
    });
  }
  next();
}

// properties to look for
const hasValidProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);
// fields for validation
const validFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];
// check the valid fields
function hasValidFields(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !validFields.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }

  next();
}

// Route Handlers

// list all reservations
async function list(req, res) {
  const { date, mobile_number } = req.query
  const data = await (
    mobile_number 
    ? service.search(mobile_number)
    : service.list(date)
  )
  res.json({ data });
}

// create a new reservation
async function create(req, res) {
  const data = await service.create(req.body.data)
  res.status(201).json({ data })
}

// read a specific reservation 
function read(req, res) {
  res.json({ data: res.locals.reservation })
}

// update reservation that isn't finished
async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: req.params.reservation_id,
    status: req.body.data.status,
  };

  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: "a finished reservation cannot be updated",
    });
  }

  const data = await service.update(updatedReservation);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasValidProperties,
    validateDate,
    validateTime,
    validatePeople,
    checkCurrentStatus,
    asyncErrorBoundary(create)
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidFields,
    hasValidProperties,
    validatePeople,
    validateDate,
    validateTime,
    hasValidStatus,
    hasValidFields,
    asyncErrorBoundary(update)
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasValidFields,
    hasValidStatus,
    asyncErrorBoundary(update)
  ]
};