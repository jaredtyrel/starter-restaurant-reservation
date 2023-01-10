import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// utils
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

// Route Imports
import CreateReservation from "../reservations/CreateReservation";
import CreateTable from "../tables/CreateTable";
import SeatTable from "../seatTable/SeatTable";
import Search from "../dashboard/Search";
import Dashboard from "../dashboard/Dashboard";
import EditReservation from "../reservations/EditReservation";
import ReservationStatus from "../reservations/ReservationStatus";

// error handler
import NotFound from "./NotFound";

export default function Routes() {
  const query = useQuery();
  const date = query.get("date");

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/reservations/new">
        <CreateReservation />
      </Route>

      <Route path="/reservations/:reservation_id/seat">
        <SeatTable />
      </Route>

      <Route path="/reservations/:reservation_id/status">
        <ReservationStatus />
      </Route>

      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>

      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/tables/new">
        <CreateTable />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={date || today()} />
      </Route>

      <Route exact={true} path="/search">
        <Search />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}