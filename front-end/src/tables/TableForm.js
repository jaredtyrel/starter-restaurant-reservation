import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

// utils/error handler
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

//table form
export default function FormTable() {
  const history = useHistory();
  const [error, setError] = useState(null);

  //empty form
  const initialState = {
    table_name: "",
    capacity: 0,
  };

  const [table, setTable] = useState(initialState);

  function changeHandler({ target: { name, value } }) {
    setTable((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  //for capacity
  function changeHandlerNum({ target: { name, value } }) {
    setTable((prevState) => ({
      ...prevState,
      [name]: Number(value),
    }));
  }

  function submitHandler(event) {
    event.preventDefault();

    createTable(table)
      .then(() => {
        history.push("/");
      })
      .catch(setError);
  }

  return (
    <main>
      <ErrorAlert error={error} />
      <p>Create A New Table</p>
      <form onSubmit={submitHandler}>
        <div>
          <div>
            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
            <input
              className="form-control"
              id="table_name"
              name="table_name"
              type="text"
              min="2"
              value={table.table_name}
              onChange={changeHandler}
              placeholder="Table Name"
              required={true}
            />
            <small className="form-text text-muted">
              Table Name must have at least two characters.
            </small>
          </div>

          <div>
            <label className="form-label" htmlFor="capacity">
              Capacity
            </label>
            <input
              className="form-control"
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              value={table.capacity}
              onChange={changeHandlerNum}
              placeholder="Table Capacity"
              required={true}
            />
            <small className="form-text text-muted">
              Table must have a capacity of at least one person.
            </small>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={history.goBack}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}