import React from "react";

export default function ResForm({ handleChange, handleSubmit, handleCancel, reservation }) {
    return (
        <form>
        <label>
        First Name:
        <input type="text" name="first_name" value={reservation.first_name} onChange={handleChange} />
        </label>
        <label>
        Last Name:
        <input type="text" name="last_name" onChange={handleChange} placeholder={reservation.last_name} />
        </label>
        <label>
        Mobile Number:
        <input type="text" name="mobile_number" onChange={handleChange} placeholder={reservation.mobile_number} />
        </label>
        <label>
        Date of reservation:
        <input type="date" name="reservation_date" onChange={handleChange} placeholder={reservation.reservation_date} />
        </label>
        <label>
        Time of reservation:
        <input type="time" name="reservation_time" onChange={handleChange} placeholder={reservation.reservation_time} />
        </label>
        <label>
        Number of people in the party:
        <input type="number" name="people" onChange={handleChange} placeholder={reservation.people} />
        </label>
        <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit</button>
        <button onClick={handleCancel} className="btn btn-danger">Cancel</button>
        </form>
      );    
}