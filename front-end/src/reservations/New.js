import React from "react";
import Routes from "./Routes";

// route: /reservations/new

// Form containing follow fields:
// First name: `<input name="first_name" />`
// Last name: `<input name="last_name" />`
// Mobile number: `<input name="mobile_number" />`
// Date of reservation: `<input name="reservation_date" />`
// Time of reservation: `<input name="reservation_time" />`
// Number of people in the party, which must be at least 1 person. 
// `<input name="people" />`

const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",

}

const handleSubmit = async (event) => {
    event.preventDefault();
    if (card.front.trim() ==="" || card.back.trim() ===""){window.alert('Please enter all fields')}
    else {await createCard(deckId, card);history.push(`/decks/${deck.id}`);}
  };

function New() {
    return (
<form>
  <label>
    First Name:
    <input type="text" name="first_name" onChange={this.handleChange} />
  </label>
  <label>
    Last Name:
    <input type="text" name="last_name" onChange={this.handleChange} />
  </label>
  <label>
    Mobile Number:
    <input type="text" name="mobile_number" onChange={this.handleChange} />
  </label>
  <label>
  Date of reservation:
    <input type="text" name="reservation_date" onChange={this.handleChange} />
  </label>
  <label>
  Time of reservation:
    <input type="text" name="reservation_time" onChange={this.handleChange} />
  </label>
  <label>
  Number of people in the party:
    <input type="text" name="people" onChange={this.handleChange} />
  </label>
  <input type="submit" value="Submit" />
</form>
    )
}

export default New