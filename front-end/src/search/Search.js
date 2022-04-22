import React, { useEffect, useState } from "react";
import { listAllReservations } from "../utils/api"

export default function Search() {

    const initialFormState = {
        mobile_number: "",
    };

    const [ formData, setFormData ] = useState({ ...initialFormState }); 
    const [ reservations, setReservations ] = useState([]);
    const [ reservationsErrors, setReservationsErrors ] = useState([]);
    const [ showRes, setShowRes ] = useState(true);
    const [ foundRes, setFoundRes ] = useState([]);

    useEffect(()=> {
        const abortController = new AbortController();
        setReservationsErrors(null);
        listAllReservations(abortController.signal)
        .then(setReservations)
        .catch(setReservationsErrors)
      }, []);    

    const handleChange = ({ target }) => {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });
      };  

      function phonenumber(inputtxt) {
        const format = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if(inputtxt.match(format)) {
          return true;
        } else {
            return false;
          }
      };      

    const handleSubmit = async (event) => {
        event.preventDefault();
        // takes in phone number, validates input,
        setShowRes(false);
        // removes spaces, characters, letters
        const formattedNum = formData.mobile_number.replace(/[^A-Z0-9]/ig, "");
        console.log("Formatted number:", formattedNum)
        // prints true / false if formatted mobile number is a valid number or not
        console.log("Format function:", phonenumber(formattedNum));

        if (phonenumber(formattedNum) === true) {
            console.log("Mobile Number Is Valid");
            const foundReservation = reservations.filter((reservation) => Number(reservation.mobile_number.replace(/[^A-Z0-9]/ig, "")) === Number(formattedNum));
            console.log(foundReservation);
            setFoundRes(foundReservation);
        } else {
            setShowRes(true);
            window.alert('Number Is Invalid')
        };


        // if valid, make api call
    };

    // form, on submit calls handle search
    // make get api call to /reservations
    // filter through all, if reservation.mobile_number !== mobile_number from search return no reservations found
    // if reservation, table with data filled with res details

    /*
    <div><h2>Search Reservations</h2></div>
    <div class="input-group">
    <input type="search" class="form-control rounded" placeholder="Mobile Number" aria-label="Search" aria-describedby="search-addon" />
    <button type="button" class="btn btn-outline-primary">search</button>
    </div>
    */


return (
    <div>
        <form>
        <label>
            Mobile Number:
            <input type="text" name="mobile_number" onChange={handleChange} placeholder={"Mobile Number"} />
        </label>
        <button type="submit" onClick={handleSubmit} className="btn btn-primary">Search</button>
        </form>
        
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
          {showRes ? 
          reservations.map((reservation, index) => (
            <tr key={index}>
            <td>{index}</td>
            <td>{`${reservation.first_name}, ${reservation.last_name}`}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td>{reservation.status}</td>
            <td>
            </td>
            <td><button className="btn btn-secondary" >Edit</button></td>
            <td><button className="btn btn-secondary" >Cancel</button></td>            
            </tr>
          )) 
          : foundRes ?
          foundRes.map((reservation, index) => (
            <tr key={index}>
            <td>{index}</td>
            <td>{`${reservation.first_name}, ${reservation.last_name}`}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td>{reservation.status}</td>
            <td>
            </td>
            <td><button className="btn btn-secondary" >Edit</button></td>
            <td><button className="btn btn-secondary" >Cancel</button></td>            
            </tr>
          ))
        : "No Reservations Found"}
        </tbody>
      </table>

    </div>
    )
}