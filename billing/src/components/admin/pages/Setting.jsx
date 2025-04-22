import React from "react";
import { Link } from "react-router-dom";

function Setting() {
  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Setting</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard" className="text-decoration-none">
                Home
              </Link>
            </li>

            <li className="breadcrumb-item active">Setting</li>
          </ol>
        </nav>
      </div>
    </main>
  );
}

export default Setting;
