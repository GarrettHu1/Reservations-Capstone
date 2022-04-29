import { React, useState } from 'react'

export default function List(input, reservations) {
    //create a new array by filtering the original array
    // const filteredData = reservations.filter((res) => {
    //     // returns res that include number searched for
    //     if (res.mobile_number.replace(/[^A-Z0-9]/ig, "").includes(input)) {
    //         return res;
    //     }
    // })
    const resData = {reservations}
    console.log(reservations)
    const filteredData = []

    return (
        <ul>
            {filteredData.map((item) => (
                <li key={item.id}>{item.text}</li>
            ))}
        </ul>
    )
}