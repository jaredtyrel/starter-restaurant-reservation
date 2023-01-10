import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import { listReservations, listTables } from "../utils/api";
import useQuery from "../utils/useQuery"
import { next, previous } from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "./Reservation"
import Table from "./Table"

function Dashboard({ date }) {
  const query = useQuery()
  const queryDate = query.get("date")
  const today = new Date().toJSON().slice(0, 10);
  const history = useHistory()
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([])
  const [tablesError, setTablesError] = useState(null)
  const [dashDate, setDashDate] = useState(queryDate ? queryDate : today);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)
    return () => abortController.abort();
  }
  const dayHandlerPrevious = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${previous(dashDate)}`);
    setDashDate(previous(dashDate));
  };
  const dayHandlerNext = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${next(dashDate)}`);
    setDashDate(next(dashDate));
  };
  const dayHandlerToday = (event) => {
    event.preventDefault();
    setDashDate(today);
    history.push(`/dashboard?date=${today}`);
  };

  // create a list of all tables
  const tableList = tables.map((table) => (
    <Table loadDashboard={loadDashboard} key={table.table_id} table={table} />
  ));

  // create a list of all reservations
  const reservationList = reservations.map((reservation) => (
    <Reservation
      loadDashboard={loadDashboard}
      key={reservation.reservation_id}
      reservation={reservation}
    />
  ));

  // return a header, with buttons, and two tables, one with our reservations, other with the tables
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />

      <div className="row">
        <div className="btn-group col" role="group" aria-label="Basic example">
          <button
            type="button"
            className="btn btn-danger"
            onClick={dayHandlerPrevious}
          >
            <span className="oi oi-chevron-left"></span>
            &nbsp;Previous
          </button>
          <button type="button" className="btn btn-secondary" onClick={dayHandlerToday}>
            Today
          </button>
          <button type="button" className="btn btn-primary" onClick={dayHandlerNext}>
            Next&nbsp;
            <span className="oi oi-chevron-right"></span>
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Mobile</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Party Size</th>
            <th scope="col">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reservationList}
        </tbody>
      </table>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>

      <main>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Table Number</th>
              <th scope="col">Capacity</th>
              <th scope="col">In use?</th>
              <th scope="col">Finished</th>
            </tr>
          </thead>
          <tbody>
            {tableList}
          </tbody>
        </table>
      </main>
    </main>
  );
}

export default Dashboard;