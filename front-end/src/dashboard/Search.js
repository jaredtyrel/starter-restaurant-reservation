import React, { useState } from "react";
import Reservation from "./Reservation";

//utils
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
  const mobileNumber = { mobile_number: "" };
  const [phoneNumber, setPhoneNumber] = useState({ ...mobileNumber });

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  function loadSearch(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(phoneNumber, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  const changeHandler = (event) => {
    setPhoneNumber({ ...phoneNumber, [event.target.name]: event.target.value });
  };

  const reservationList = reservations.map((reservation) => (
    <Reservation key={reservation.reservation_id} reservation={reservation} />
  ));

  const showErrors = reservationsError && (
    <ErrorAlert error={reservationsError} />
  );

  return (
    <div>
      {showErrors}
      <h1>This is the Search page</h1>
      <form onSubmit={loadSearch}>
        <div>
          <input
            placeholder="Search by Phone number"
            onChange={changeHandler}
            value={phoneNumber.mobile_number}
            required
            name="mobile_number"
          />
        </div>
        <br />
        <button type="submit" className="btn btn-info">
          Search
        </button>
      </form>
      <br />
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Mobile</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Party Size</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservationList
          ) : (
            <tr>
              <td>No reservations found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Search;