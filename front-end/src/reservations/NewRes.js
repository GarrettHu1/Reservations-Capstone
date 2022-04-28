import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api"
import ResForm from "./ResForm";

export default function NewRes() {

const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "booked"
};

const [ reservation, setreservation ] = useState({ ...initialFormState });
const [ errors, setErrors ] = useState([]);
const history = useHistory();

const handleChange = ({ target }) => {
    if (target.type === "number") {
        setreservation({
            ...reservation,
            [target.name]: Number(target.value),
          });
    } else {
    setreservation({
      ...reservation,
      [target.name]: target.value,
    });}
  };  

const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors([]);

    const handleSubErrors = [];

    let a = reservation.first_name;
    let b = reservation.last_name;
    let c = reservation.mobile_number;
    let d = reservation.reservation_date;
    let e = reservation.reservation_time;
    let f = reservation.people;

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
        || (resYear === year && resMonth < mes) 
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

        setErrors(handleSubErrors);

        if (handleSubErrors.length === 0){
        const ac = new AbortController();
        await createReservation(reservation, ac.signal);
        // returns user to dashboard
        history.push(`/dashboard?date=${d}`);
        // clears form 
        // setreservation(initialFormState); 
        return () => ac.abort();
    }

    }
}

  const handleCancel = (event) => {
    event.preventDefault();
    setreservation(initialFormState);
    history.goBack();
  };

    return (
        <ResForm handleCancel={handleCancel} handleSubmit={handleSubmit} handleChange={handleChange} reservation={reservation} errors={errors} />
    )
};
