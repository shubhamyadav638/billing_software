import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getBills } from "../../redux/slice/addBill.slice";

function AllBills() {
  const columns = [
    {
      name: "No",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Cust_Phone",
      selector: (row) => row.customerPhone,
      sortable: true,
    },
    {
      name: "Discount",
      selector: (row) => `₹ ${row.discount}`,
      sortable: true,
    },
    {
      name: "SubTotal",
      selector: (row) => `₹ ${row.subTotal}`,
      sortable: true,
    },
    {
      name: "GrandTotal",
      selector: (row) => `₹ ${row.grandTotal}`,
      sortable: true,
    },

    {
      name: "Tax",
      selector: (row) => `₹ ${row.totalTax}`,
      sortable: true,
    },
    {
      name: "Bill_Status",
      selector: (row) => `₹ ${row.billstatus}`,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="btn btn-sm btn-primary me-2"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#billModal"
            onClick={() => {
              getItem(row._id);
            }}
          >
            Print
          </button>
          <button className="btn btn-sm btn-danger">Cancel</button>
        </>
      ),
    },
  ];

  const dispatch = useDispatch();
  const { bills, loading } = useSelector((state) => state.bills);

  const [printBill, setPrintBill] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  const getItem = (billId) => {
    const selectedBillItem = bills.find((bill) => bill._id === billId);
    setPrintBill(selectedBillItem);
    setSelectedBill(selectedBillItem);
  };

  useEffect(() => {
    dispatch(getBills());
  }, [dispatch]);

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>All Bills</h1>
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

      <DataTable
        columns={columns}
        data={bills}
        progressPending={loading}
        selectableRows
      />

      <div className="modal fade" id="billModal" tabIndex="-1">
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Bill</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cust_Phone</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {printBill.billItems?.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.customerno}</td>
                      <td>{item.itemName}</td>
                      <td>{item.quantity}</td>
                      <td>₹ {Number(item.price.$numberDecimal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="row">
                <div className="col-6">Subtotal</div>
                <div className="col-6 text-end">
                  ₹ {selectedBill?.subTotal.toFixed(2)}
                </div>
                <div className="col-6">Tax</div>
                <div className="col-6 text-end">
                  ₹ {selectedBill?.taxAmount?.toFixed(2)}
                </div>
                <div className="col-6">Discount</div>
                <div className="col-6 text-end">
                  ₹ {selectedBill?.discount.toFixed(2)}
                </div>
                <div className="col-6 fw-bold">Grand Total</div>
                <div className="col-6 text-end fw-bold">
                  ₹ {selectedBill?.grandTotal.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-center">
              <button className="btn btn-primary" type="button">
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AllBills;
