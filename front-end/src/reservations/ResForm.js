import React from "react";

export default function ResForm({ handleChange, handleSubmit, handleCancel, errors, reservation }) {

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
        <input type="text" name="first_name" onChange={handleChange} value={reservation.first_name} placeholder={"First Name"} />
    </label>
    <label>
        Last Name:
        <input type="text" name="last_name" onChange={handleChange} value={reservation.last_name} placeholder={"Last Name"} />
    </label>
    <label>
        Mobile Number:
        <input type="text" name="mobile_number" onChange={handleChange} value={reservation.mobile_number} placeholder={"Mobile Number"} />
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
}