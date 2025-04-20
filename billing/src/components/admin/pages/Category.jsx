import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoMdAddCircle } from "react-icons/io";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

import {
  addCategory,
  clearMessages,
  deleteCategory,
  editCategory,
  getCategories,
} from "../../redux/slice/item.slice";

const columnsConfig = (handleEdit, handleDelete) => [
  {
    name: "No",
    selector: (row) => row.no,
    sortable: true,
    width: "80px",
  },
  {
    name: "Image",
    selector: (row) => row.image,
    sortable: false,
    width: "200px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Action",
    selector: (row) => row.action,
    sortable: false,
    cell: (row) => (
      <>
        <button
          className="btn btn-sm btn-warning me-2"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          onClick={() => handleEdit(row)}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDelete(row.id)}
        >
          Delete
        </button>
      </>
    ),
  },
];

function Category() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { loading, error, success, categories } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    itemName: "",
    img: null,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img") {
      setFormData((prev) => ({ ...prev, img: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (row) => {
    setIsEditMode(true);
    setEditingId(row.id);
    setFormData({ itemName: row.name, img: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this category?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCategory(id))
          .then(() => {
            dispatch(getCategories());
            Swal.fire("Deleted!", "Category has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Error!", "Something went wrong.", "error");
          });
      }
    });
  };

  const resetForm = () => {
    setFormData({ itemName: "", img: null });
    setIsEditMode(false);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.itemName.trim()) {
      Swal.fire(
        "Validation Error",
        "Please enter a valid category name.",
        "error"
      );
      return;
    }
    if (!formData.img && !isEditMode) {
      Swal.fire("Validation Error", "Please upload an image.", "error");
      return;
    }

    const data = new FormData();
    data.append("itemName", formData.itemName);
    if (formData.img) {
      data.append("img", formData.img);
    }

    if (isEditMode) {
      dispatch(editCategory({ id: editingId, formData: data }))
        .then(() => {
          resetForm();
          dispatch(getCategories());
          Swal.fire("Updated!", "Category updated successfully.", "success");
        })
        .catch(() => {
          Swal.fire("Error!", "Error updating category!", "error");
        });
    } else {
      dispatch(addCategory(data))
        .then(() => {
          resetForm();
          dispatch(getCategories());
          Swal.fire("Success!", "Category added successfully.", "success");
        })
        .catch(() => {
          Swal.fire("Error!", "Error adding category!", "error");
        });
    }
  };

  const categoryData = categories?.map((category, index) => ({
    id: category._id,
    no: index + 1,
    image: (
      <img
        src={category.imgUrl}
        alt={category.itemName}
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
    ),
    name: category.itemName,
  }));

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Category</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard" className="text-decoration-none">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">Items</li>
            <li className="breadcrumb-item active">Category</li>
          </ol>
        </nav>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Category List</h5>
        <button
          className="btn btn-primary d-flex align-items-center gap-1"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          onClick={resetForm}
        >
          <IoMdAddCircle size={20} />
          Add Category
        </button>
      </div>

      <DataTable
        columns={columnsConfig(handleEdit, handleDelete)}
        data={categoryData}
        selectableRows
        progressPending={loading}
      />

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  {isEditMode ? "Edit Category" : "Add Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={resetForm}
                ></button>
              </div>
              <div className="modal-body">
                {/* {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )} */}

                <div className="mb-3">
                  <label htmlFor="file" className="form-label">
                    Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file"
                    name="img"
                    accept="image/*"
                    onChange={handleChange}
                    ref={fileInputRef}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? isEditMode
                      ? "Updating..."
                      : "Saving..."
                    : isEditMode
                    ? "Update Category"
                    : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Category;
