import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../redux/slice/user.slice";
import Swal from "sweetalert2";

function Profile() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    address: user?.address || "",
    mobileNo: user?.mobileNo || "",
    email: user?.email || "",
  });

  useEffect(() => {
    setProfileData({
      fullName: user?.fullName || "",
      address: user?.address || "",
      mobileNo: user?.mobileNo || "",
      email: user?.email || "",
    });
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const id = user?.id;
    try {
      const resultAction = await dispatch(updateProfile({ id, profileData }));
      if (updateProfile.fulfilled.match(resultAction)) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully!",
        });
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        throw new Error(resultAction.error?.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Failed to update profile: ${error.message}`,
      });
    }
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Profile</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard" className="text-decoration-none">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link className="text-decoration-none">Profile</Link>
            </li>
          </ol>
        </nav>
      </div>

      <div className="card">
        <div className="card-body pt-3">
          <ul className="nav nav-tabs nav-tabs-bordered" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#profile-edit"
                aria-selected="false"
                role="tab"
                tabIndex="-1"
              >
                Edit Profile
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-change-password"
                aria-selected="false"
                role="tab"
                tabIndex="-1"
              >
                Change Password
              </button>
            </li>
          </ul>

          <div className="tab-content pt-2">
            <div
              className="tab-pane fade profile-edit pt-3 show active"
              id="profile-edit"
              role="tabpanel"
            >
              <form onSubmit={handleProfileSubmit}>
                <div className="row mb-3">
                  <label className="col-md-4 col-lg-3 col-form-label">
                    Profile Image
                  </label>
                  <div className="col-md-8 col-lg-9">
                    <img
                      src={"assets/img/profile-img.jpg"}
                      alt="Profile"
                      className="img-thumbnail"
                    />
                    <div className="pt-2">
                      <input type="file" style={{ display: "none" }} />
                      <a
                        href="#"
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          document.querySelector('input[type="file"]').click()
                        }
                        title="Upload new profile image"
                      >
                        <i className="bi bi-upload"></i> Upload
                      </a>
                      <a
                        href="#"
                        className="btn btn-danger btn-sm"
                        title="Remove my profile image"
                      >
                        <i className="bi bi-trash"></i> Remove
                      </a>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <label className="col-md-4 col-lg-3 col-form-label">
                    Full Name
                  </label>
                  <div className="col-md-8 col-lg-9">
                    <input
                      name="fullName"
                      type="text"
                      className="form-control"
                      id="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label className="col-md-4 col-lg-3 col-form-label">
                    Address
                  </label>
                  <div className="col-md-8 col-lg-9">
                    <input
                      name="address"
                      type="text"
                      className="form-control"
                      id="Address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label className="col-md-4 col-lg-3 col-form-label">
                    Phone
                  </label>
                  <div className="col-md-8 col-lg-9">
                    <input
                      name="mobileNo"
                      type="text"
                      className="form-control"
                      id="mobileNo"
                      value={profileData.mobileNo}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label className="col-md-4 col-lg-3 col-form-label">
                    Email
                  </label>
                  <div className="col-md-8 col-lg-9">
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      id="Email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            <div
              className="tab-pane fade pt-3"
              id="profile-change-password"
              role="tabpanel"
            >
              <form>
                <div className="row mb-3">
                  <label className="col-md-4 col-lg-3 col-form-label">
                    Current Password
                  </label>
                  <div className="col-md-8 col-lg-9">
                    <input
                      name="currentPassword"
                      type="password"
                      className="form-control"
                      id="currentPassword"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label className="col-md-4 col-lg-3 col-form-label">
                    New Password
                  </label>
                  <div className="col-md-8 col-lg-9">
                    <input
                      name="newPassword"
                      type="password"
                      className="form-control"
                      id="newPassword"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label className="col-md-4 col-lg-3 col-form-label">
                    Re-enter New Password
                  </label>
                  <div className="col-md-8 col-lg-9">
                    <input
                      name="renewPassword"
                      type="password"
                      className="form-control"
                      id="renewPassword"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
