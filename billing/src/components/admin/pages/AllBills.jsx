import React from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "No",
    selector: (row) => row.no,
    sortable: true,
  },
  {
    name: "Image",
    selector: (row) => row.image,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Action",
    selector: (row) => row.action,
    sortable: true,
  },
];

const data = [
 
];

function AllBills() {
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
              <Link to="/all-bills" className="text-decoration-none">
                All Bills
              </Link>
            </li>
          </ol>
        </nav>
      </div>

      <DataTable columns={columns} data={data} selectableRows />
    </main>
  );
}

export default AllBills;
