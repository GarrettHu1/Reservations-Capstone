import React, { useState, useEffect } from "react";
// import TextField from "@mui/material/TextField";
import { listAllReservations } from "../utils/api"
import List from "./List";

export default function SearchBar() {

    const [ searchNumber, setSearchNumber ] = useState('null');
    const [ reservations, setReservations ] = useState([]);
    const [ reservationsErrors, setReservationsErrors ] = useState([]);

    useEffect(()=> {
        const ac = new AbortController();
        setReservationsErrors(null);
        listAllReservations(ac.signal)
        .then(setReservations)
        .catch(setReservationsErrors)
      }, []);
      console.log(reservations)

    if(reservationsErrors) console.log(reservationsErrors);

    let inputHandler = (e) => {
        const formattedNumber = e.target.value.replace(/[^A-Z0-9]/ig, "");
        setSearchNumber(formattedNumber);
    };

    return (
        <div className="main">
          <h1>React Search</h1>
          <div className="search">
            <form>
            <label for="mobile_number">
            Mobile Number:
            <input type="text" pattern="[0-9]*" name="mobile_number" onChange={inputHandler} placeholder={"Enter the customer's mobile number"} />
        </label>
            </form>
          </div>
          <List input={searchNumber} resData={reservations} />
        </div>
      );
}

