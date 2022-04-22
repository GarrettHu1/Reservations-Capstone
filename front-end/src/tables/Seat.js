import React, { useEffect, useState } from "react";
import {
    useParams,
    useHistory
  } from "react-router-dom";
import { listTables, updateTable, listReservations, updateReservationStatus } from "../utils/api";
import { today } from "../utils/date-time";


export default function Seat() {

    const { reservation_id } = useParams();
    const [ reservations, setReservations ] = useState([]);
    const [ resError, setResError ] = useState(null);
    const [ resToBeSeated, setResToBeSeated ] = useState([]);

    const [ tables, setTables ] = useState([]);
    const [ tablesError, setTablesError ] = useState(null);

    const [ seatErrors, setSeatErrors ] = useState([]);
    const history = useHistory();

    // load all reservations on initial page load, then whenever currentDay is updated
    useEffect(loadDash, []);

    function loadDash() {
      const abortController = new AbortController();
      setTablesError(null);
      listTables(abortController.signal)
        .then(setTables)
        .catch(setTablesError);
        
      listReservations(today(), abortController.signal)
        .then((result) => setReservations(result))
        .catch(setResError)

      return () => abortController.abort();
    };
  if (tablesError) console.log(tablesError);
  if (resError) console.log(resError);

  // when reservations is updated, sets resToBeSeated to the reservation with matching reservation_id from params
  useEffect(()=> {
    const found = reservations.find((reservation) => Number(reservation.reservation_id) === Number(reservation_id));
    // console.log("found:", found);
    setResToBeSeated(found);
  }, [reservations]);

async function handleSeat(table) {
    // take resId from params,
    // make put req to "tables" table, at url/${id}/seat with reservation_id: resId
    // console.log("Table Id:", table.table_id, "Reservation Id:", reservation_id)
    // console.log(table)

    setSeatErrors([]);

    const values = {
      "reservation_id": reservation_id, 
      "table_id": table.table_id,
      "reservations": reservations,
    };

    const { people } = resToBeSeated;
    const handleSubErrors = [];

    const capacityError = `Table does not have enough capacity. Seating for ${people} is needed.`;
    const occupiedError = `Table id is occupied: ${table.table_id}`;

    // validations
    if (Number(people) > Number(table.capacity)) {
      handleSubErrors.push(capacityError);
    };
    if (table.reservation_id !== null) {
       handleSubErrors.push(occupiedError);
    };
    
    // sets seatErrors to errors from submitting
    setSeatErrors(handleSubErrors);

    // if no errors, sends put request to update reservation_id col in table, and put to update status to seated
    if (handleSubErrors.length === 0) {
    const ac = new AbortController();
    console.log(reservation_id)
    updateReservationStatus(reservation_id, ac.signal);
    updateTable(values, ac.signal);
    history.push("/dashboard")
  };

}

const handleCancel = (event) => {
    event.preventDefault();
    // setFormData(initialFormState);
    history.goBack();
  };

  // filters tables that have a reservation seated
  // const filteredTables = tables.filter((table) => table.reservation_id == null);

    return (
        <div>
            Seat Reservation:
            {resToBeSeated &&
            <h3>{`# ${resToBeSeated.reservation_id} - 
            ${resToBeSeated.first_name} ${resToBeSeated.last_name} on 
            ${resToBeSeated.reservation_date} at 
            ${resToBeSeated.reservation_time} for 
            ${resToBeSeated.people}`}</h3>}
            {seatErrors.length > 0 &&
            <div className="alert alert-danger" role="alert" >
                Please fix the following errors:
                {seatErrors.map((error)=> <li>{error}</li>)}
            </div>
            }
            {tables.map((table, index) => (
            <div className="tabledivs">
            Table: {table.table_name} Capacity: {table.capacity}
            <button type="submit" onClick={() => handleSeat(table)} className="btn btn-primary">Seat</button>  
            </div>              
          ))}
          <button onClick={handleCancel} className="btn btn-secondary">Cancel</button>
        </div>
    )
}