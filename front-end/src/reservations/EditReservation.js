import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listReservations, editReservation, readReservation } from "../utils/api";
import { today, formatAsDate } from "../utils/date-time";
import ResForm from "./ResForm";

export default function EditRes() {

const [ errors, setErrors ] = useState([]);
const history = useHistory();
const resId  = useParams().reservation_id;

const [ reservation, setReservation ] = useState([]);
const [ reservationsError, setReservationsError ] = useState(null);

// const initialFormState = {
//     first_name: reservation.first_name,
//     last_name: reservation.last_name,
//     mobile_number: reservation.mobile_number,
//     reservation_date: reservation.reservation_date,
//     reservation_time: reservation.reservation_time,
//     people: reservation.people,
//     status: reservation.status
// };
// console.log("initialFormState:", initialFormState)

const [ formData, setFormData ] = useState(null);

  // load all reservations on initial page load, then finds single reservation to edit
  useEffect(loadDashboard, []);

  function loadDashboard() {
    const ac = new AbortController();
    setReservationsError(null);
    // listReservations(today(), abortController.signal)
    //   .then((reservations)=> {
    //       const foundRes = reservations.find((reservation) => reservation.reservation_id === Number(resId.reservation_id))
    //       setReservation(foundRes)
    //       setFormData(foundRes)
    //   })
    readReservation(resId, ac.signal)
    .then((reservation) => {
      const newRes = {...reservation, reservation_date: formatAsDate(reservation.reservation_date)}
        setReservation(newRes);
        setFormData(newRes)
    })
      .catch(setReservationsError);

      
    return () => ac.abort();
  };

  if (reservationsError) console.log(reservationsError);
//   console.log("Found reservation:", reservation)



console.log("initial form data---------------", formData);
console.log("reservation data`````", reservation);


const handleChange = ({ target }) => {
    if (target.type === "date") {
        setFormData({
            ...formData,
            [target.name]: target.value.replace(/[^A-Z0-9]/ig, "").slice(0, 8),
          });
    } else if (target.type === "number") {
    setFormData({
      ...formData,
      [target.name]: Number(target.value),
    });} else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });}

  };  

const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("formData on submit ----", formData)

    setErrors([]);

    const handleSubErrors = [];

    let a = formData.first_name;
    let b = formData.last_name;
    let c = formData.mobile_number;
    let d = formData.reservation_date.replace(/[^A-Z0-9]/ig, "");
    let e = formData.reservation_time;
    let f = formData.people;

    if ( a === "" || b === "" || c === "" || d === "" || f < 1 || e === ""){
        console.log(formData)
        window.alert('Please fill in all values')
    } else {
        console.log("Form data passes validations````````", formData)
    // res date values
    const resDate = new Date(d);
    console.log(d);
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
    // console.log(resHour, resMin)
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
        history.push(`/dashboard?date=${formData.reservation_date}`);
    }
    }
};

  const handleCancel = (event) => {
    event.preventDefault();
    // setFormData(initialFormState);
    history.go(-1);
  };

  // console.log(reservation)

    return (
      <div>
        <h1>Edit Reservation</h1>
        <ResForm handleCancel={handleCancel} handleSubmit={handleSubmit} handleChange={handleChange} reservation={reservation} errors={errors} /> 
      </div>
    )
};
