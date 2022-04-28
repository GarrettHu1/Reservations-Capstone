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
        const ac = new AbortController();
        setReservationsErrors(null);
        listAllReservations(ac.signal)
        .then(setReservations)
        .catch(setReservationsErrors)
      }, []);

      if(reservationsErrors) console.log(reservationsErrors);

    const handleChange = ({ target }) => {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });
      };  

      // Phone number input format validation, follows ###-###-####
      // function phonenumber(inputtxt) {
      //   const format = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      //   if(inputtxt.match(format)) {
      //     return true;
      //   } else {
      //       return false;
      //     }
      // };      

      function findResFromNumber(reservations, searchNum) {
        // const phoneNumb = new Array(data);
        const data = reservations.filter(x => x.mobile_number.replace(/[^A-Z0-9]/ig, "").includes(searchNum));
        console.log("reservations includes number from search", data)
        return data
      };  

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("number:", formData);

        // takes in phone number, validates input,
        setShowRes(false);

        // removes spaces, characters, letters
        const formattedNum = formData.mobile_number.replace(/[^A-Z0-9]/ig, "");
        console.log("Formatted number:", Number(formattedNum))

        // prints true / false if formatted mobile number is a valid number or not
        // console.log("Format function:", phonenumber(formattedNum));

        if (formattedNum) {
            console.log("Mobile Number Is Valid");
            const reservationsFromSearch = await findResFromNumber(reservations, formattedNum);

            console.log("reservationsFromSearch", reservationsFromSearch);
            if (reservationsFromSearch) {
              setFoundRes(reservationsFromSearch);
            } else {
              setFoundRes(null);
            }
        } else {
            setShowRes(true);
            window.alert('Number Is Invalid');
        };


        // if valid, make api call
    };


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
            <input type="text" pattern="[0-9]*" name="mobile_number" onChange={handleChange} placeholder={"Enter the customer's mobile number"} />
        </label>
        <button type="submit" onClick={handleSubmit} className="btn btn-primary">Find</button>
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
            </tr>
          )) 
          : foundRes.length > 0 ?
          foundRes.map((reservation, index) => (
            <tr key={index}>
            <td>{index}</td>
            <td>{`${reservation.first_name}, ${reservation.last_name}`}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td>{reservation.status}</td>       
            </tr>
          ))
        : "No reservations found"}
        </tbody>
      </table>

    </div>
    )
}