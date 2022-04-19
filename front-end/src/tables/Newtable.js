import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api"

export default function NewTable() {

const initialFormState = {
    table_name: "",
    capacity: "",
};

const [ formData, setFormData ] = useState({ ...initialFormState });
const [ errors, setErrors ] = useState([]);
const history = useHistory();

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

    // reset errors
    setErrors([]);
    // temp error container
    let handleSubErrors = [];
    // table form values
    let a = formData.table_name;
    let b = Number(formData.capacity);
    // error mesage
    const capacityError = "Table must have at least person";

    if ( a === "" || b === "" ){
        window.alert('Please fill in all values')
    } else {
        if (b < 1) {
            handleSubErrors.push(capacityError);
        }
        setErrors(handleSubErrors);
        if (handleSubErrors.length === 0){
        const ac = new AbortController();
        await createTable(formData, ac.signal);
        // returns user to dashboard
        history.push(`/dashboard`);
        // clears form 
        // setFormData(initialFormState); 
    }
  }
}

  const handleCancel = (event) => {
    event.preventDefault();
    setFormData(initialFormState);
    history.goBack();
  };

    return (
        <main>
            <h1>Create Table</h1>
            {errors.length > 0 &&
            <div className="alert alert-danger" role="alert" >
                Please fix the following errors:
                {errors.map((error)=> <li>{error}</li>)}
            </div>
            }
            <form>
        <label>
            Table Name:
            <input type="text" name="table_name" onChange={handleChange} placeholder={"Table Name"} />
        </label>
        <label>
            Capacity:
            <input type="number" name="capacity" onChange={handleChange} placeholder={"Capacity"} />
        </label>
        <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit</button>
        <button onClick={handleCancel} className="btn btn-danger">Cancel</button>
        </form>
        </main> 
    )
};
