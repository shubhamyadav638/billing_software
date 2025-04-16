import React, { useState, useEffect } from "react";
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
import toast from "react-hot-toast";
import { getCategories } from "../../redux/slice/item.slice";

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
  const { categories } = useSelector((state) => state.categories);
  const { items, loading } = useSelector((state) => state.items);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
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
    if (!image && !isEditMode) errors.image = "Image is required";
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setItemName("");
    setPrice("");
    setUnit("");
    setCategory("");
    setImage(null);
    setFormError({});
    setSubmitError("");
    setIsEditMode(false);
    setEditItemId(null);
  };

  const handleSubmit = async () => {
    setSubmitError("");
    if (!validateForm()) return;

    const formData = {
      itemName,
      price,
      unit,
      category,
    };

    const toastId = toast.loading(
      isEditMode ? "Updating item..." : "Adding item..."
    );

    try {
      if (isEditMode) {
        await dispatch(
          editItem({ id: editItemId, itemData: formData, file: image })
        ).unwrap();
        toast.success("Item updated successfully", { id: toastId });
      } else {
        await dispatch(addItem({ itemData: formData, file: image })).unwrap();
        toast.success("Item added successfully", { id: toastId });
      }
      resetForm();
      document.getElementById("closeModalBtn").click();
    } catch (err) {
      toast.error(err.message || "Failed to submit", { id: toastId });
      setSubmitError(err.message || "Failed to submit");
    }
  };

  const handleEdit = (item) => {
    setItemName(item.itemName);
    setPrice(item.price.toString());
    setUnit(item.unit);
    setCategory(item.category);
    setImage(null);
    setIsEditMode(true);
    setEditItemId(item._id);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmed) return;

    const toastId = toast.loading("Deleting item...");
    try {
      await dispatch(deleteItem(id)).unwrap();
      toast.success("Item deleted successfully", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Failed to delete item", { id: toastId });
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
          <IoMdAddCircle size={20} />
          Add items
        </button>
      </div>

      <DataTable
        columns={columnsConfig(handleEdit, handleDelete)}
        data={items}
        progressPending={loading}
      />

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
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
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  {formError.image && (
                    <small className="text-danger">{formError.image}</small>
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

                <div className="col-4 mb-3">
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

                <div className="col-4 mb-3">
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

                <div className="col-4 mb-3">
                  <label htmlFor="category" className="form-label">
                    Choose category
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
