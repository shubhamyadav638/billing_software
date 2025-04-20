import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoMdAddCircle } from "react-icons/io";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  editItem,
  deleteItem,
  getAllItems,
} from "../../redux/slice/additem.slice";
import { getCategories } from "../../redux/slice/item.slice";
import Swal from "sweetalert2";

const columnsConfig = (handleEdit, handleDelete) => [
  {
    name: "No",
    selector: (row, index) => index + 1,
    sortable: true,
    width: "80px",
  },
  {
    name: "Image",
    width: "200px",
    sortable: false,
    selector: (row) => (
      <img
        src={row.img}
        alt={row.itemName}
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
    ),
  },
  {
    name: "Name",
    selector: (row) => row.itemName,
    sortable: true,
  },
  {
    name: "Price",
    selector: (row) =>
      typeof row.price === "object" && row.price.$numberDecimal
        ? row.price.$numberDecimal
        : row.price,
    sortable: true,
  },
  {
    name: "Unit",
    selector: (row) => row.unit,
    sortable: true,
  },
  {
    name: "Gst",
    selector: (row) => row.gst + "%",
    sortable: true,
  },
  {
    name: "Action",
    cell: (row) => (
      <>
        <button
          className="btn btn-sm btn-warning me-2"
          onClick={() => handleEdit(row)}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDelete(row._id)}
        >
          Delete
        </button>
      </>
    ),
  },
];

function AllItem() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { categories } = useSelector((state) => state.categories);
  const { items, loading } = useSelector((state) => state.items);

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [gst, setGst] = useState("");
  const [image, setImage] = useState(null);
  const [formError, setFormError] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    dispatch(getAllItems());
    dispatch(getCategories());
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};
    if (!itemName) errors.itemName = "Item name is required";
    if (!price) errors.price = "Price is required";
    if (!unit) errors.unit = "Unit is required";
    if (!category || category === "Select...")
      errors.category = "Category is required";
    if (!gst || gst === "Select...") errors.gst = "GST is required";
    if (!image && !isEditMode) errors.image = "Image is required";
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setItemName("");
    setPrice("");
    setUnit("");
    setCategory("");
    setGst("");
    setImage(null);
    setFormError({});
    setSubmitError("");
    setIsEditMode(false);
    setEditItemId(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async () => {
    setSubmitError("");
    if (!validateForm()) return;

    const formData = {
      itemName,
      price,
      unit,
      category,
      gst,
    };

    Swal.fire({
      title: isEditMode ? "Updating item..." : "Adding item...",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
    });

    try {
      if (isEditMode) {
        await dispatch(
          editItem({ id: editItemId, itemData: formData, file: image })
        ).unwrap();
        Swal.fire("Success", "Item updated successfully", "success");
      } else {
        await dispatch(addItem({ itemData: formData, file: image })).unwrap();
        Swal.fire("Success", "Item added successfully", "success");
      }
      dispatch(getAllItems());
      resetForm();
      document.getElementById("closeModalBtn").click();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to submit", "error");
      setSubmitError(err.message || "Failed to submit");
    }
  };

  const handleEdit = (item) => {
    setItemName(item.itemName);
    setPrice(
      typeof item.price === "object" && item.price.$numberDecimal
        ? item.price.$numberDecimal
        : item.price.toString()
    );
    setUnit(item.unit);
    setCategory(item.category);
    setGst(item.gst?.toString() || "");
    setImage(null);
    setIsEditMode(true);
    setEditItemId(item._id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Deleting item...",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
    });

    try {
      await dispatch(deleteItem(id)).unwrap();
      Swal.fire("Deleted!", "Item deleted successfully.", "success");
      dispatch(getAllItems());
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to delete item", "error");
    }
  };

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
            <li className="breadcrumb-item">Items</li>
            <li className="breadcrumb-item active">All items</li>
          </ol>
        </nav>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Items List</h5>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={resetForm}
        >
          <IoMdAddCircle size={20} /> Add items
        </button>
      </div>

      <DataTable
        columns={columnsConfig(handleEdit, handleDelete)}
        data={items}
        progressPending={loading}
      />

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                {isEditMode ? "Edit Item" : "Add Item"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModalBtn"
              />
            </div>

            <div className="modal-body">
              {submitError && (
                <div className="alert alert-danger">{submitError}</div>
              )}

              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="file" className="form-label">
                    Image {isEditMode && "(optional)"}
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  {formError.image && (
                    <small className="text-danger">{formError.image}</small>
                  )}
                  {isEditMode && !image && (
                    <img
                      src={items.find((i) => i._id === editItemId)?.img}
                      alt="Current"
                      className="mt-2"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                  {formError.itemName && (
                    <small className="text-danger">{formError.itemName}</small>
                  )}
                </div>

                <div className="col-6 mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  {formError.price && (
                    <small className="text-danger">{formError.price}</small>
                  )}
                </div>

                <div className="col-6 mb-3">
                  <label htmlFor="unit" className="form-label">
                    Unit
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                  {formError.unit && (
                    <small className="text-danger">{formError.unit}</small>
                  )}
                </div>

                <div className="col-6 mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    id="category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select...</option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.itemName}
                      </option>
                    ))}
                  </select>
                  {formError.category && (
                    <small className="text-danger">{formError.category}</small>
                  )}
                </div>

                <div className="col-6 mb-3">
                  <label htmlFor="gst" className="form-label">
                    GST (%)
                  </label>
                  <select
                    id="gst"
                    className="form-select"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                  {formError.gst && (
                    <small className="text-danger">{formError.gst}</small>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {isEditMode ? "Update Item" : "Save Item"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AllItem;
