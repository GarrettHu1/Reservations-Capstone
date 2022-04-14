import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [ currentDay, setCurrentDay ] = useState(date)
  // const [ newDate, setNewDate ] = useState()

  // load all reservations on initial page load, then whenever currentDay is updated
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  };

  const goBack = (event) => {
    event.preventDefault();
    // get current date, subtract 24hrs to get day before
    // load reservations from that day
    setCurrentDay(previous(currentDay));
  };

  const goToday = (event) => {
    event.preventDefault();
    setCurrentDay(today())
  };

  const goNext = (event) => {
    event.preventDefault();
    // get current date, add 24hrs to get day after
    // load reservations from that day
    setCurrentDay(next(today()));
  };



  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
        <div className="btn-group" role="group" aria-label="navigation buttons">
          <button className="btn btn-secondary" onClick={(goBack)}>
            <span className="oi oi-chevron-left"></span>
            &nbsp;Previous
            </button>
            <button className="btn btn-secondary" onClick={goToday}>
              Today
              </button>
              <button className="btn btn-secondary" onClick={goNext}>
                Next&nbsp;<
                  span class="oi oi-chevron-right"></span>
                  </button>
                  </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>{currentDay}</div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>People</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            reservation.reservation_date === currentDay &&
            <tr key={index}>
            <td>{index}</td>
            <td>{`${reservation.first_name}, ${reservation.last_name}`}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            </tr>
          ))}
        </tbody>
      </table>      
      
    </main>
  );
}

export default Dashboard;
