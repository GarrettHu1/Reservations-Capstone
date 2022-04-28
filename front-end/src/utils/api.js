/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 * temp
*/
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
 
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

// cancel in-flight api calls
// const ac = new AbortController();

export async function createReservation(formData, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({data: formData}),
    signal
  };

  return await fetchJson(url, options)
};

export async function createTable(formData, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({data: formData}),
    signal
  };

  return await fetchJson(url, options)
};

export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);

  const options = {
    method: "GET",
    headers,
    signal
  };

  return await fetchJson(url, options)
};

export async function listAllReservations(signal) {
  const url = new URL(`${API_BASE_URL}/reservations/all`);

  const options = {
    method: "GET",
    headers,
    signal
  };

  return await fetchJson(url, options)
};

// function to find a reservation using its id
export async function readReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`

  // if method not specified, defaults to get
  return await fetchJson(url, {headers, signal}, {});
};

// function to insert reservation_id into table to "seat" a reservation
export async function updateTable(ids, signal) {
  const { table_id } = ids;
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({data: ids}),
    signal
  };
  try {
    const response = await fetch(url, options);
    const {data} = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export async function request(url, options) {
  try {
    const response = await fetch(url, options);
    // verify status is 200
    if (response.status === 200) {
      const {data} = await response.json();
      return data;
    }
  } catch (error) {
    throw error;
  }
};

// function to remove reservation_id from table
export async function deleteRes(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({data: table_id}),
    signal
  };
  try {
    const response = await fetch(url, options);
    const {data} = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

// onFinish table => 
export async function finishTable(table_id, reservation_id) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
    headers,
  };
  return await fetchJson(url, options, {});
}

// functino to update status of reservation being seated from "booked" to "seated"
export async function updateReservationStatus(
    // data,
    reservationId, 
    signal
  ) {
    // const { reservation_id } = data;
    // const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
    const url = `${API_BASE_URL}/reservations/${reservationId}/status`;
    const options = {
      method: "PUT",
      headers,
      body: JSON.stringify({
        // data: data
        data: {
          status: "cancelled"
        }
      }),
      signal
    };
    try {
      const response = await fetch(url, options);
      const {data} = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
};

export async function updateReservation(reservation, signal) {
  const { reservation_date, reservation_time, reservation_id } = reservation;
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;

  const data = {
    ...reservation,
    reservation_date: Array.isArray(reservation_date)
      ? reservation_date[0]
      : reservation_date,
    reservation_time: Array.isArray(reservation_time)
      ? reservation_time[0]
      : reservation_time,
  };

  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };
  const response = await fetchJson(url, options, reservation);

  return Array.isArray(response) ? response[0] : response;
}

export async function editReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation.reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({data: reservation}),
    signal
  };
  try {
    const response = await fetch(url, options);
    const {data} = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export async function seatReservation(reservation_id, table_id) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { reservation_id } }),
    headers,
  };
  return await fetchJson(url, options, {});
};



