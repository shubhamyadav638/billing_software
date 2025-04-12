import React from "react";
import { Link } from "react-router-dom";

function AllItem() {
  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>All items</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard" className="text-decoration-none">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link className="text-decoration-none">Items</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/all-items" className="text-decoration-none">
                All items
              </Link>
            </li>
          </ol>
        </nav>
      </div>
    </main>
  );
}

export default AllItem;
