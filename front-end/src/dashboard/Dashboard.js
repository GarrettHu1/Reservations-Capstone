import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { listReservations, listTables, deleteRes, updateReservationStatus, finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next, formatAsDate } from "../utils/date-time"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  
  const [ reservations, setReservations ] = useState([]);
  const [ reservationsError, setReservationsError ] = useState(null);
  const [ tables, setTables ] = useState([]);
  const [ tablesError, setTablesError ] = useState(null);
  // const [ currentDay, setCurrentDay ] = useState(today());

  const location = useLocation();
  const history = useHistory();

  // console.log("today", currentDay)

  // load all reservations on initial page load, then whenever currentDay is updated
  // useEffect(loadDashboard, [currentDay]);
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    // if (location.search) {
    //   const dateFromQuery = formatAsDate(location.search)
    //   console.log("dateFromQuery:", dateFromQuery)
    //   // console.log("currentDay:", currentDay)
    // }
    // listReservations(currentDay, abortController.signal)
    listReservations({date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables().then(setTables).catch(setTablesError);
    return () => abortController.abort();
  };

  // useEffect(()=> {
  //   const abortController = new AbortController();
  //   setReservationsError(null);
  //   listReservations(currentDay, abortController.signal)
  //   .then(setReservations)
  //   .catch(setReservationsError)
  // }, [currentDay])

  if (reservationsError) console.log(reservationsError);

    // load all reservations on initial page load, then whenever currentDay is updated
    // useEffect(loadDash, []);

    // function loadDash() {
    //   const abortController = new AbortController();
    //   setTablesError(null);
    //   listTables(abortController.signal)
    //     .then(setTables)
    //     .catch(setTablesError);
    //   return () => abortController.abort();
    // };
  if (tablesError) console.log(tablesError);

  const goBack = (event) => {
    // event.preventDefault();
    // get current date, subtract 24hrs to get day before
    // load reservations from that day
    // setCurrentDay(previous(date));
    history.push(`/dashboard?date=${previous(date)}`);
  };

  const goToday = (event) => {
    // event.preventDefault();
    // setCurrentDay(today())
    history.push(`/dashboard?date=${today()}`);
  };

  const goNext = (event) => {
    // event.preventDefault();
    // get current date, add 24hrs to get day after
    // load dashboard containing reservations from query for that day
    // setCurrentDay(next(date));
    history.push(`/dashboard?date=${next(date)}`);
  };

  // async function handleCancel(resId) {
  //   if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
  //     const ac = new AbortController();
  //     const reqData = { reservation_id: resId, status: "cancelled" };
  //     updateReservationStatus(reqData, ac.signal);
  //     window.location.reload();
  //   }; 
  // };

  function cancel(reservation_id) {
    console.log("Cancelling")
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      updateReservationStatus(reservation_id)
      .then(loadDashboard)
      .catch(setReservationsError)
    }
  }

  function onFinish(table_id, reservation_id) {
    finishTable(table_id, reservation_id)
      .then(loadDashboard)
  }

  // async function handleFinish(tableId, resId) {
  //   // make a del req to tables, remove reservation_id
  //   if (window.confirm("Is this table ready to seat new guests?")) {
  //     const ac = new AbortController();
  //     deleteRes(tableId, ac.signal);
  //     console.log("handleFinish:", resId)
  //     window.location.reload();
  //   };
  // };

  // filters reservations to only return those with "booked" or "seated" status
  const filteredReservations = reservations.filter((reservation) => reservation.status === "booked" || reservation.status === "seated")

  // Old button
  // <button className="btn btn-secondary" 
  // onClick={()=> {
  //   history.push(`/reservations/${reservation.reservation_id}/seat`);
  // }}>
  // Seat
  // </button>

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">{`Reservations for ${date}`}</h4>
        <div className="btn-group" role="group" aria-label="navigation buttons">
        <button className="btn btn-secondary" onClick={(goBack)}>
        <span className="oi oi-chevron-left"></span>
        &nbsp;Previous
        </button>
        <button className="btn btn-secondary" onClick={goToday}>
        Today
        </button>
        <button className="btn btn-secondary" onClick={goNext}>
        <span class="oi oi-chevron-right"></span>&nbsp;
        Next
        </button>
        </div>
      </div>

      <ErrorAlert error={reservationsError} />
      
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>People</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.length > 0 ? filteredReservations.map((reservation, index) => (
            <tr key={index}>
            <td>{reservation.reservation_id}</td>
            <td>{`${reservation.first_name}, ${reservation.last_name}`}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td>{reservation.status}</td>
            <td>
            {reservation.status === "booked" && 
            <a href={`/reservations/${reservation.reservation_id}/seat`}><button className="btn btn-secondary">Seat</button></a>
            }
            </td>
            <td>
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
                <button className="btn btn-secondary">Edit</button>
            </a>
            </td>
            <td>
              {/* <button className="btn btn-secondary" reservation-id-cancel={reservation.reservation_id} 
            onClick={() => handleCancel(reservation.reservation_id) }>Cancel</button> */}
            <button className="btn btn-secondary" data-reservation-id-cancel={reservation.reservation_id} 
            onClick={() => cancel(reservation.reservation_id)}>
              Cancel
            </button>
            </td>         
            </tr>
          )) : "No Reservations Found"}
        </tbody>
      </table>
      
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Free?</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table, index) => (
            <tr key={index}>
            <td>{index}</td>
            <td>{`${table.table_name}`}</td>
            <td>{table.capacity}</td>
            <td>{`${table.reservation_id ? "occupied" : "free"}`}</td>        
            <td>{ table.reservation_id && 
            // <button className="btn btn-secondary" onClick={() => handleFinish(table.table_id, table.reservation_id) }>Finish</button> }
            <button 
              className="btn btn-secondary" 
              onFinish={onFinish}>
                Finish
            </button> }
            
            </td>
            </tr>
          ))}
        </tbody>
      </table>

    </main>
  );
}

export default Dashboard;
