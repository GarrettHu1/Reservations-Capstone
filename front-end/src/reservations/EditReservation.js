import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listReservations, editReservation } from "../utils/api";
import { today } from "../utils/date-time";

export default function EditRes() {

const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "booked"
};

const [ formData, setFormData ] = useState({ ...initialFormState });
const [ errors, setErrors ] = useState([]);
const history = useHistory();
const resId  = useParams();

const [ reservation, setReservation ] = useState([]);
const [ reservationsError, setReservationsError ] = useState(null);
const [ currentDay, setCurrentDay ] = useState(today());

  // load all reservations on initial page load, then finds single reservation to edit
  useEffect(loadDashboard, [currentDay]);

  async function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(currentDay, abortController.signal)
      .then((reservations)=> {
          const foundRes = reservations.find((reservation) => reservation.reservation_id === Number(resId.reservation_id))
          setReservation(foundRes)
      })
      .catch(setReservationsError);
    return () => abortController.abort();
  };

  if (reservationsError) console.log(reservationsError);
//   console.log("Found reservation:", reservation)


const handleChange = ({ target }) => {
    if (target.type === "number") {
        setFormData({
            ...formData,
            [target.name]: Number(target.value),
          });
    } else {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });}

  };  

const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors([]);

    const handleSubErrors = [];

    let a = formData.first_name;
    let b = formData.last_name;
    let c = formData.mobile_number;
    let d = formData.reservation_date;
    let e = formData.reservation_time;
    let f = formData.people;

    if ( a === "" || b === "" || c === "" || d === "" || f < 1 || e === ""){
        window.alert('Please fill in all values')
    } else {

    // res date values
    const resDate = new Date(d);
    const resMonth = Number(d.slice(5, 7));
    const resDay = Number(d.slice(8, 10));
    const resYear = Number(d.slice(0, 4));

    // check what day Mon - Sun, 0 - 6
    const dateValue = resDate.getDay();

    // current date values
    const today = new Date();
    const year = today.getFullYear();
    const mes = today.getMonth()+1;
    const dia = today.getDate();

    // current hours/mins
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();

    // res hours & mins
    const resMin = Number(e.slice(3, 5));
    const resHour = Number(e.slice(0, 2));

    // error types
    const dateTimeError = "Reservation date/time must occur in the future";
    const tuesError = "Reservation Date is on a Tuesday";
    const openingHoursError = "Reservation time must be during opening hours";
    
    // if reservation date is on a tuesday, push tuesError
    if (dateValue === 1) {
        // if errortype doe not already exist in errors
        if (!errors.includes(tuesError)) {
            handleSubErrors.push(tuesError)
            console.log(errors)
        }
        console.log(errors);
    }
    
    // if res date/time is in the past, push dateTimeError
    console.log(resHour, resMin)
    if (
        resYear < year 
        || (resMonth === mes && resDay < dia) 
        || resMonth < mes 
        || (resDay === dia && resMonth === mes && resYear === year && hours > resHour )
        ) {
        // setErrors( ...errors, dateError)
        handleSubErrors.push(dateTimeError);
        console.log(errors);
        }

        if (
            (resHour === hours && resMin < mins)
            || (resHour < 10)
            || (resHour === 10 && resHour < 30)
            || (resHour > 21)
            || (resHour === 21 && resMin > 30)
        ) {
            handleSubErrors.push(openingHoursError);
        }

        setErrors(handleSubErrors)
        if (handleSubErrors.length === 0){
        const ac = new AbortController();
        await editReservation(formData, ac.signal);
        // returns user to dashboard
        history.push(`/dashboard?date=${d}`);
        // clears form 
        // setFormData(initialFormState); 
    }

    }
}

  const handleCancel = (event) => {
    event.preventDefault();
    // setFormData(initialFormState);
    history.goBack();
  };

    return (
        <main>
            <h1>Create Reservation</h1>
            {errors.length > 0 &&
            <div className="alert alert-danger" role="alert" >
                Please fix the following errors:
                {errors.map((error)=> <li>{error}</li>)}
            </div>
            }
            <form>
        <label>
            First Name:
            <input type="text" name="first_name" onChange={handleChange} value={reservation.first_name} />
        </label>
        <label>
            Last Name:
            <input type="text" name="last_name" onChange={handleChange} value={reservation.last_name} />
        </label>
        <label>
            Mobile Number:
            <input type="text" name="mobile_number" onChange={handleChange} value={reservation.mobile_number} />
        </label>
        <label>
            Date of reservation:
            <input type="date" name="reservation_date" onChange={handleChange} value={reservation.reservation_date} />
        </label>
        <label>
            Time of reservation:
            <input type="time" name="reservation_time" onChange={handleChange} value={reservation.reservation_time} />
        </label>
        <label>
            Number of people in the party:
            <input type="number" name="people" onChange={handleChange} value={reservation.people} />
        </label>
        <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit</button>
        <button onClick={handleCancel} className="btn btn-danger">Cancel</button>
        </form>
        </main> 
    )
};
