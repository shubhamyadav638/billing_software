import React from "react";
import { Link } from "react-router-dom";

function AddBills() {
  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Add items</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard" className="text-decoration-none">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link className="text-decoration-none">Bills</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/add-bills" className="text-decoration-none">
                Add bills
              </Link>
            </li>
          </ol>
        </nav>
      </div>
    </main>
  );
}

export default AddBills;
