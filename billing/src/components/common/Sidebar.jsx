import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearToken } from "../redux/slice/user.slice";
import toast from "react-hot-toast";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearToken());
    toast.success("Logged out successfully!");
    navigate("/");
  };
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link className="nav-link text-decoration-none" to="/dashboard">
            <i className="bi bi-grid" />
            <span>Dashboard</span>
          </Link>
        </li>

        <li className="nav-item">
          <a
            className="nav-link collapsed text-decoration-none"
            data-bs-target="#components-nav"
            data-bs-toggle="collapse"
          >
            <i className="bi bi-menu-button-wide" />
            <span>Bills</span>
            <i className="bi bi-chevron-down ms-auto" />
          </a>
          <ul
            id="components-nav"
            className="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to="/all-bills" className="text-decoration-none">
                <i className="bi bi-circle " />
                <span>All Bills</span>
              </Link>
            </li>

            <li>
              <Link to="/add-bills" className="text-decoration-none">
                <i className="bi bi-circle" />
                <span>Add Bills</span>
              </Link>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a
            className="nav-link collapsed text-decoration-none"
            data-bs-target="#forms-nav"
            data-bs-toggle="collapse"
          >
            <i className="bi bi-journal-text" />
            <span>Items</span>
            <i className="bi bi-chevron-down ms-auto" />
          </a>
          <ul
            id="forms-nav"
            className="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to="/all-items" className="text-decoration-none">
                <i className="bi bi-circle" />
                <span>All Items</span>
              </Link>
            </li>

            <li>
              <Link to="/category" className="text-decoration-none">
                <i className="bi bi-circle" />
                <span>Category</span>
              </Link>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a
            className="nav-link collapsed text-decoration-none"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-in-right" />
            <span>Log out</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
