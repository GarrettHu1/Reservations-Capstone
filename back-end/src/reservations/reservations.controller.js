/**
 * List handler for reservation resources
 */
async function list(req, res) {
  // lists all reservations for a day (from query)

  
  const day = req.query.date;

  res.json({
    data: [],
  });
}

module.exports = {
  list,
};
