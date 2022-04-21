import React, { useEffect, useState } from "react";
import {
    useParams,
    useHistory
  } from "react-router-dom";
import { listTables, updateTable, listReservations } from "../utils/api";
import { today } from "../utils/date-time";


export default function Seat() {

    const { reservation_id } = useParams();
    const [ tables, setTables ] = useState([]);
    const [ res, setRes ] = useState([]);
    const [ tablesError, setTablesError ] = useState(null);
    const [ resError, setResError ] = useState(null);
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
        .then((result) => setRes(...result))
        .catch(setResError)

      return () => abortController.abort();
    };
  if (tablesError) console.log(tablesError);

async function handleSubmit(table) {
    // take resId from params,
    // make put req to "tables" table, at url/${id}/seat with reservation_id: resId
    console.log("Table Id:", table.table_id, "Reservation Id:", reservation_id)
    console.log(table)

    setSeatErrors([]);

    const ids = {"reservation_id": reservation_id, "table_id": table.table_id}
    const { people } = res;
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

    // if no errors, sends put request to update reservation_id col in table
    if (handleSubErrors.length === 0) {
    const ac = new AbortController();
    await updateTable(ids, ac.signal);
    history.push("/");
  };

}

const handleCancel = (event) => {
    event.preventDefault();
    // setFormData(initialFormState);
    history.goBack();
  };

  // filters tables that have a reservation seated
  const filteredTables = tables.filter((table) => table.reservation_id == null);

    return (
        <div>
            Seat Reservation:
            <h3>{`# ${res.reservation_id} - ${res.first_name} ${res.last_name} on ${res.reservation_date} at ${res.reservation_time} for ${res.people}`}</h3>
            
            {seatErrors.length > 0 &&
            <div className="alert alert-danger" role="alert" >
                Please fix the following errors:
                {seatErrors.map((error)=> <li>{error}</li>)}
            </div>
            }
            {tables.map((table, index) => (
            <div className="tabledivs">
            Table: {table.table_name} Capacity: {table.capacity}
            <button onClick={handleCancel} className="btn btn-secondary">Cancel</button>
            <button type="submit" onClick={() => handleSubmit(table)} className="btn btn-primary">Seat</button>  
            </div>              
          ))}

        </div>
    )
}