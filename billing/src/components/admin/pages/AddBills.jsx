import React, { useEffect, useState } from "react";
import { getCategories } from "../../redux/slice/item.slice";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementQuantity,
  getAllItems,
  incrementQuantity,
} from "../../redux/slice/additem.slice";

function AddBills() {
  const dispatch = useDispatch();
  const { items, cart } = useSelector((state) => state.items);
  const { categories } = useSelector((state) => state.categories);
  const [disCount, setDiscount] = useState(0);

  const handleDiscount = (e) => {
    setDiscount(Number(e.target.value));
  };

  // console.log(disCount);

  useEffect(() => {
    dispatch(getAllItems());
    dispatch(getCategories());
  }, [dispatch]);

  const handleAddcart = (item) => {
    dispatch(addToCart(item));
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + parseFloat(item.price.$numberDecimal) * item.quantity,
    0
  );

  const grandTotal = subTotalPrice - disCount;

  return (
    <main id="main" className="main">
      <div className="row">
        <div className="col-8">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">All Items</h5>
                  <ul className="nav nav-pills nav-fill">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        aria-current="page"
                        href="#"
                      >
                        All
                      </a>
                    </li>
                    {categories.map((category) => (
                      <li className="nav-item" key={category._id}>
                        <a
                          className="nav-link"
                          href="#"
                          id={category._id.toLowerCase()}
                        >
                          {category.itemName}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="row">
                    {items?.map((item) => (
                      <div className="col-3" key={item._id}>
                        <div className="card">
                          <img
                            src={item.img}
                            className="card-img-top"
                            alt="..."
                            style={{
                              width: "100%",
                              height: "130px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="card-body ">
                            <p className="card-text">{item.itemName}</p>
                            <div className="d-flex justify-content-between">
                              <p className="card-text">
                                Rs.{item.price.$numberDecimal}
                              </p>
                              <button
                                className="btn btn-primary btn-sm "
                                onClick={() => handleAddcart(item)}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card vh-100">
            <div className="card-header">
              <div className="row justify-content-between">
                <div className="col-2">
                  <i className="bi bi-cart"></i>
                  <span className="badge bg-primary badge-number">
                    {cart.length}
                  </span>
                </div>
                <div className="col-2">
                  <i className="bi bi-trash3"></i>
                </div>
              </div>
            </div>

            <div className="card-body overflow-auto">
              {/* add item des...  */}
              {cart.map((item) => (
                <div className="row p-1 border rounded " key={item._id}>
                  <div className="col-3 text-center">
                    <img
                      src={item.img}
                      alt={item.itemName}
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-9">
                    <p className="mb-2">{item.itemName}</p>
                    <div className="d-flex justify-content-between">
                      <div className="d-flex gap-3">
                        <i
                          className="bi bi-file-minus-fill"
                          style={{ cursor: "pointer" }}
                          onClick={() => dispatch(decrementQuantity(item._id))}
                        ></i>
                        <span className="fw-bold">{item.quantity}</span>

                        <i
                          className="bi bi-file-plus-fill"
                          style={{ cursor: "pointer" }}
                          onClick={() => dispatch(incrementQuantity(item._id))}
                        ></i>
                      </div>
                      <div className="text-end">
                        <span>
                          {` ${item.quantity} × ₹ ${
                            item.price.$numberDecimal
                          } = ₹ ${(
                            item.quantity *
                            parseFloat(item.price.$numberDecimal)
                          ).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* add item desi end*/}
            </div>

            <div className="card-footer">
              <div className="d-grid gap-2">
                <div className="row justify-content-between my-2">
                  <div className="d-grid gap-2">
                    <div className="row">
                      <div className="col-6 ">Subtotal </div>
                      <div className="col-6 text-end">
                        {`₹ ${subTotalPrice.toFixed(2)}`}
                      </div>
                    </div>
                    <div className="row justify-content-between my-2">
                      <div className="col-6">Discount </div>
                      <div className="col-6 text-end">
                        <input
                          type="number"
                          style={{ width: "80px" }}
                          value={disCount}
                          onChange={handleDiscount}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">Grand total </div>
                  <div className="col-6 text-end">
                    {` ₹ ${grandTotal.toFixed(2)}`}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#smallModal"
                >
                  Submit
                </button>
                <div className="modal fade" id="smallModal" tabindex="-1">
                  <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title text-center">Bill</h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="row modal-body">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Item</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">Price</th>
                              <th scope="col">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cart.map((item, index) => (
                              <tr key={item._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.itemName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price.$numberDecimal}</td>
                                <td>{subTotalPrice}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="row justify-content-between my-2">
                          <div className="d-grid gap-2">
                            <div className="row">
                              <div className="col-6 ">Subtotal </div>
                              <div className="col-6 text-end">
                                {`₹ ${subTotalPrice.toFixed(2)}`}
                              </div>
                            </div>
                            <div className="row justify-content-between my-2">
                              <div className="col-6">Discount </div>
                              <div className="col-6 text-end">
                                <input
                                  type="number"
                                  style={{ width: "80px" }}
                                  value={disCount}
                                  onChange={handleDiscount}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-6">Grand total </div>
                          <div className="col-6 text-end">
                            {` ₹ ${grandTotal.toFixed(2)}`}
                          </div>
                        </div>
                      </div>

                      <div className="modal-footer">
                        <button className="btn btn-primary" type="button">
                          Proceed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AddBills;
