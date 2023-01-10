import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function CreateReservation() {
  const history = useHistory();

  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [reservation, setReservation] = useState(initialState);
  const [error, setError] = useState(null);

  function submitHandler(event) {
    event.preventDefault();
    createReservation(reservation)
      .then((createdReservation) => {
        const res_date =
          createdReservation.reservation_date.match(/\d{4}-\d{2}-\d{2}/)[0];
        history.push(`/dashboard?date=` + res_date);
      })
      .catch(setError);
  }

  return (
    <main>
      <ErrorAlert error={error} />
      <h1>Create a New Reservation</h1>
      <ReservationForm
        reservation={reservation}
        setReservation={setReservation}
        submitHandler={submitHandler}
      />
    </main>
  );
}

export default CreateReservation;