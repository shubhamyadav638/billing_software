import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllItems,
  addToCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} from "../../redux/slice/additem.slice";
import { getCategories } from "../../redux/slice/item.slice";
import { submitBill } from "../../redux/slice/addBill.slice";
import Swal from "sweetalert2";
import { CiCirclePlus } from "react-icons/ci";

function AddBills() {
  const dispatch = useDispatch();
  const { items, cart } = useSelector((state) => state.items);
  const { categories } = useSelector((state) => state.categories);

  // console.log(items);

  const [finalItems, setFinalItems] = useState([]);
  const [disCount, setDiscount] = useState(0);
  const [customerPhone, setCustomerPhone] = useState("");
  const closeModal = useRef();
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [activeCategory, setActiveCategory] = useState("All");

  const handleSubmitBill = async () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cart is empty. Please add items.",
      });
      return;
    }

    if (customerPhone && !/^\d{10}$/.test(customerPhone)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Please enter a valid 10-digit number.",
      });
      return;
    }

    const addBillData = {
      items: cart,
      subTotal: subTotalPrice.toFixed(2),
      discount: disCount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      createdAt: new Date(),
      totalTax: totalTax.toFixed(2),
      customerPhone: customerPhone,
      billStatus: "Active",
      paymentMethod: paymentMethod,
    };

    try {
      await dispatch(submitBill(addBillData)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Bill added successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      dispatch(clearCart());
      setCustomerPhone("");
      setDiscount(0);
      closeModal.current?.click();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to add bill. Please try again.",
      });
    }
  };
  useEffect(() => {
    dispatch(getAllItems());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    setFinalItems(items);
  }, [items]);

  const handleDiscount = (e) => {
    setDiscount(Number(e.target.value));
  };

  const getCategoryData = (category_id) => {
    setActiveCategory(category_id);
    const categoryItems = items.filter((item) => item.category === category_id);
    setFinalItems(categoryItems);
  };

  const handleAddcart = (item) => {
    dispatch(addToCart(item));
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + parseFloat(item.price.$numberDecimal) * item.quantity,
    0
  );

  const totalTax = cart.reduce(
    (acc, item) =>
      acc +
      (parseFloat(item.price.$numberDecimal) * item.quantity * item.gst) / 100,
    0
  );

  const grandTotal = subTotalPrice - disCount + totalTax;

  return (
    <main id="main" className="main">
      <div className="row">
        <div className="col-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">All Items</h5>
              <ul className="nav nav-pills nav-fill mb-3">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeCategory === "All" ? "active" : ""
                    }`}
                    onClick={() => {
                      setFinalItems(items);
                      setActiveCategory("All");
                    }}
                  >
                    All
                  </button>
                </li>
                {categories.map((category) => (
                  <li className="nav-item" key={category._id}>
                    <button
                      className={`nav-link ${
                        activeCategory === category._id ? "active" : ""
                      }`}
                      onClick={() => getCategoryData(category._id)}
                    >
                      {category.itemName}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="row">
                {finalItems?.map((item) => (
                  <div className="col-3" key={item._id}>
                    <div className="card mb-3">
                      <img
                        src={item.img}
                        className="card-img-top"
                        alt={item.itemName}
                        style={{
                          width: "100%",
                          height: "130px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="card-body">
                        <p className="card-text">{item.itemName}</p>
                        <div className="d-flex justify-content-between">
                          <p className="card-text">
                            ₹ {item.price.$numberDecimal}
                          </p>
                          <button
                            className="btn btn-primary btn-sm"
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

        <div className="col-4">
          <div className="card vh-100">
            <div className="card-header d-flex justify-content-between">
              <div>
                <i className="bi bi-cart"></i>
                <span className="badge bg-primary">{cart.length}</span>
                <CiCirclePlus />
              </div>
              <div>
                <i
                  className="bi bi-trash3"
                  style={{ cursor: "pointer" }}
                  onClick={() => dispatch(clearCart())}
                ></i>
              </div>
            </div>

            <div className="p-2">
              <input
                type="number"
                className="form-control"
                placeholder="Customer Phone no"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>

            <div className="card-body overflow-auto">
              {cart.map((item) => (
                <div className="row p-1 border rounded mb-2" key={item._id}>
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
                          {`${item.quantity} × ₹ ${
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
            </div>

            <div className="card-footer">
              <div className="d-grid gap-2">
                <div className="row mb-2">
                  <div className="col-6">Subtotal</div>
                  <div className="col-6 text-end">
                    ₹ {subTotalPrice.toFixed(2)}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-6">Discount</div>
                  <div className="col-6 text-end">
                    <input
                      type="number"
                      style={{ width: "80px" }}
                      value={disCount}
                      onChange={handleDiscount}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">GST</div>
                  <div className="col-6 text-end">₹ {totalTax.toFixed(2)}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">Grand Total</div>
                  <div className="col-6 text-end">
                    ₹ {grandTotal.toFixed(2)}
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#billModal"
                >
                  Submit
                </button>

                <div className="modal fade" id="billModal" tabIndex="-1">
                  <div className="modal-dialog modal-md">
                    <div className="modal-content">
                      <div className="modal-header gap-3 ">
                        <h4 className="modal-title">Bill</h4>
                        <p className="modal-title ">
                          <span>Cust_no : </span>
                          <span>{customerPhone}</span>
                        </p>

                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          ref={closeModal}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Item</th>
                              <th>Qty</th>
                              <th>Price</th>
                              <th className="text-end">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cart.map((item, index) => (
                              <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.itemName}</td>
                                <td>{item.quantity}</td>
                                <td>₹ {item.price.$numberDecimal}</td>
                                <td className="text-end">
                                  ₹
                                  {(
                                    item.quantity *
                                    parseFloat(item.price.$numberDecimal)
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="row">
                          <div className="col-6">Subtotal</div>
                          <div className="col-6 text-end">
                            ₹ {subTotalPrice.toFixed(2)}
                          </div>
                          <div className="col-6">Discount</div>
                          <div className="col-6 text-end">
                            ₹ {disCount.toFixed(2)}
                          </div>
                          <div className="col-6">GST</div>
                          <div className="col-6 text-end">
                            ₹ {totalTax.toFixed(2)}
                          </div>
                          <div className="col-6 fw-bold">Grand Total</div>
                          <div className="col-6 text-end fw-bold">
                            ₹ {grandTotal.toFixed(2)}
                          </div>

                          <div className="col-6">Cash</div>
                          <div className="col-6 text-end ">
                            <input
                              type="number"
                              style={{ width: "80px" }}
                              // value={disCount}
                              // onChange={handleDiscount}
                            />
                          </div>
                        </div>
                        <fieldset className="d-flex align-items-center mb-3">
                          <legend className="col-form-label me-3 mb-0">
                            Payment Method
                          </legend>
                          <div className="d-flex gap-4">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id="gridRadios1"
                                value="Cash"
                                checked={paymentMethod === "Cash"}
                                onChange={(e) =>
                                  setPaymentMethod(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="gridRadios1"
                              >
                                Cash
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id="gridRadios2"
                                value="UPI"
                                checked={paymentMethod === "UPI"}
                                onChange={(e) =>
                                  setPaymentMethod(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="gridRadios2"
                              >
                                UPI
                              </label>
                            </div>
                            <div className="form-check disabled">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id="gridRadios3"
                                value="Online"
                                checked={paymentMethod === "Online"}
                                onChange={(e) =>
                                  setPaymentMethod(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="gridRadios3"
                              >
                                Online
                              </label>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      <div className="modal-footer justify-content-center">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={handleSubmitBill}
                        >
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
