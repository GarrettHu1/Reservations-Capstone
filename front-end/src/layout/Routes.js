import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewRes from "../reservations/NewRes";
import NewTable from "../tables/Newtable";
import Seat from "../tables/Seat"
import Search from "../search/Search";
import Editreservation from "../reservations/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewRes />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable />
      </Route>
      <Route path={`/reservations/:reservation_id/seat`}>
        <Seat />
      </Route>
      <Route path={`/search`}>
        <Search />
      </Route>
      <Route path={`/reservations/:reservation_id/edit`}>
        <Editreservation />
      </Route>      
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
