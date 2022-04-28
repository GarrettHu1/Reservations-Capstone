import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api"
import TableErrors from "./TableErrors";
import { today } from "../utils/date-time";

export default function NewTable() {
    const initialFormState = {
        table_name: "",
        capacity: 0,
    };

    // const [ formData, setFormData ] = useState({ ...initialFormState });
    const [ errors, setErrors ] = useState(null);
    const history = useHistory();

    // const handleChange = ({ target }) => {
    //     if (target.type === "number") {
    //         setFormData({
    //             ...formData,
    //             [target.name]: Number(target.value),
    //         });
    //     } else {
    //     setFormData({
    //     ...formData,
    //     [target.name]: target.value,
    //     });}
    // }; 
    
    const [table,  setTable] = useState(initialFormState);
    const changeHandler = ({ target: { name, value } }) => {
        setTable((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
    const changeHandlerNum = ({ target: { name, value } }) => {
        setTable((prevState) => ({
            ...prevState,
            [name]: Number(value),
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setErrors(null);
        const ac = new AbortController();
        createTable(table, ac.signal)
            .then(() => {
                history.push(`/dashboard?date=${today()}`);
            })
            .catch(setErrors);
    }

// const handleSubmit = async (event) => {
//     event.preventDefault();
//     console.log(formData, "FormData-----------------")
//     // reset errors
//     setErrors([]);
//     // temp error container
//     let handleSubErrors = [];
//     // table form values
//     const a = formData.table_name;
//     const b = Number(formData.capacity);
//     console.log("Table_name-------------", a)

//     // error types
//     const capacityError = "Table must have at least person";
//     const capacityIsNanError = "Table capacity must be a number";
//     const tableNameError = "Table name must be longer than 1 character";

//     if ( a === "" || b === "" ){
//         window.alert('Please fill in all values')
//         handleSubErrors.push(tableNameError);
//         console.log(handleSubErrors, "-----------Handle Sub Errors----------")
//     } else {
//         if (a.length < 2) {
//             handleSubErrors.push(tableNameError);
//         }
//         if (b < 1) {
//             handleSubErrors.push(capacityError);
//         }
//         if (typeof(b) !== "number") {
//             handleSubErrors.push(capacityIsNanError)
//         }
//         setErrors(handleSubErrors);
//         if (handleSubErrors.length === 0){
//         const ac = new AbortController();
//         await createTable(formData, ac.signal);
//         // returns user to dashboard
//         history.push(`/dashboard`);
//         // clears form 
//         // setFormData(initialFormState); 
//     }
//   }
// }

//   const handleCancel = (event) => {
//     event.preventDefault();
//     setFormData(initialFormState);
//     history.goBack();
//   };

    return (
        <main>
            <h1>Create Table</h1>
            {/* {errors.length > 0 &&
            <div className="alert alert-danger" role="alert" >
                Please fix the following errors:
                {errors.map((error)=> <li>{error}</li>)}
            </div>
            } */}
            <TableErrors errors={errors} />
            <form onSubmit={handleSubmit}>
                <label>
                    Table Name:
                    <input type="text" name="table_name" value={table.table_name} minlength={2} required={true} onChange={changeHandler} placeholder={"Table Name"} />
                </label>
                <label>
                    Capacity:
                    <input type="number" name="capacity" value={table.capacity} min={1} required={true} onChange={changeHandlerNum} placeholder={"Capacity"} />
                </label>
                {/* <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit</button> */}
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" onClick={() => history.goBack()}>Cancel</button>
            </form>
        </main> 
    )
};