import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// route: /reservations/new

// Form containing follow fields:
// First name: `<input name="first_name" />`
// Last name: `<input name="last_name" />`
// Mobile number: `<input name="mobile_number" />`
// Date of reservation: `<input name="reservation_date" />`
// Time of reservation: `<input name="reservation_time" />`
// Number of people in the party, which must be at least 1 person. 
// `<input name="people" />`



export default function NewRes() {

const [ formData, setFormData ] = useState({ ...initialFormState });

const history = useHistory();

const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",

};

const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

const handleSubmit = async (event) => {
    event.preventDefault();
    let a = formData.name.trim();
    let b = formData.last_name.trim();
    let c = formData.mobile_number.trim();
    let d = formData.reservation_date.trim();
    let e = formData.reservation_time.trim();
    let f = formData.people.trim();

    // if one of inputs are empty show alert
    if ( a === "" || b === "" || c === "" || d === "" || e === "" ||f === "" ){window.alert('Invalid Input')}
    else if (d === "tuesday") {}
    else {await createReservation(formData);history.push(`/reservations`);}
    // reset form state
    setFormData(initialFormState);
  };


    return (
        <main>
        <form>
        <label>
            First Name:
            <input type="text" name="first_name" onChange={handleChange} />
        </label>
        <label>
            Last Name:
            <input type="text" name="last_name" onChange={handleChange} />
        </label>
        <label>
            Mobile Number:
            <input type="text" name="mobile_number" onChange={handleChange} />
        </label>
        <label>
            Date of reservation:
            <input type="date" name="reservation_date" onChange={handleChange} />
        </label>
        <label>
            Time of reservation:
            <input type="text" name="reservation_time" onChange={handleChange} />
        </label>
        <label>
            Number of people in the party:
            <input type="text" name="people" onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
        <input type="cancel" value="Cancel" />
        </form>
        </main> 
    )
};
