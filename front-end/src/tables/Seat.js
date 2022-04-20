import React, { useEffect, useState } from "react";
import {
    useParams,
    useHistory
  } from "react-router-dom";
import { listTables } from "../utils/api";


export default function Seat() {
    // list tables with a button that pops up confirm, then set resId to the reservation's reservation_id
    // make PUT request to /tables/table_id/seat, sending the resId as reservation_id

    const { reservation_id } = useParams();
    const [ tables, setTables ] = useState([]);
    const [ tablesError, setTablesError ] = useState(null);
    const history = useHistory();

    // load all reservations on initial page load, then whenever currentDay is updated
    useEffect(loadDash, []);

    function loadDash() {
      const abortController = new AbortController();
      setTablesError(null);
      listTables(abortController.signal)
        .then(setTables)
        .catch(setTablesError);
      return () => abortController.abort();
    };
  if (tablesError) console.log(tablesError);

//   <form>
//   {tables.map((table, index) => (
//     <div class="form-check">
//     <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
//     <label class="form-check-label" for="flexCheckDefault">
//       Table: {table.table_name} Capacity: {table.capacity}
//     </label>
//   </div>
// ))}
//   </form>

function handleSubmit(id) {
    // take resId from params,
    // make put req to "tables" table, at url/${id}/seat with reservation_id: resId
    console.log("Table Id:", id, "Reservation Id:", reservation_id)

}

const handleCancel = (event) => {
    event.preventDefault();
    // setFormData(initialFormState);
    history.goBack();
  };

    return (
        <div>
            Tables:
            {tables.map((table, index) => (
            <div className="tabledivs">
            Table: {table.table_name} Capacity: {table.capacity}
            <button onClick={handleCancel} className="btn btn-secondary">Cancel</button>
            <button type="submit" onClick={() => handleSubmit(table.table_id)} className="btn btn-primary">Seat</button>  
            </div>              
          ))}

        </div>
    )
}