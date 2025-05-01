import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  removeUserImg,
  updateProfile,
} from "../../redux/slice/user.slice";
import Swal from "sweetalert2";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);
  // console.log(user);

  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: "",
    address: "",
    mobileNo: "",
    email: "",
    imgUrl: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    renewPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        address: user.address || "",
        mobileNo: user.mobileNo || "",
        email: user.email || "",
        imgUrl: user.imgUrl || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      Swal.fire("Error", "User ID missing", "error");
      return;
    }
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(profileData.mobileNo)) {
      Swal.fire(
        "Invalid Input",
        "Phone number must be at least 10 digits and numeric.",
        "warning"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      Swal.fire(
        "Invalid Input",
        "Please enter a valid email address.",
        "warning"
      );
      return;
    }
    try {
      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      formData.append("address", profileData.address);
      formData.append("mobileNo", profileData.mobileNo);
      formData.append("email", profileData.email);

      if (profileImage) {
        formData.append("img", profileImage);
      }

      const resultAction = await dispatch(
        updateProfile({ id: user._id, formData })
      );

      if (updateProfile.fulfilled.match(resultAction)) {
        Swal.fire("Success", "Profile updated successfully!", "success");
      } else {
        throw new Error(resultAction.payload || "Failed to update profile");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleRemoveImage = async () => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete your profile image.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        const resultAction = await dispatch(removeUserImg(user._id));
        if (removeUserImg.fulfilled.match(resultAction)) {
          Swal.fire(
            "Deleted!",
            "Your profile image has been removed.",
            "success"
          );
          setProfileData((prev) => ({
            ...prev,
            imgUrl: "",
          }));

          if (profileImage) {
            URL.revokeObjectURL(profileImage.preview);
          }
          setProfileImage(null);
        } else {
          throw new Error(resultAction.payload || "Failed to remove image");
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (profileImage) {
        URL.revokeObjectURL(profileImage.preview);
      }
      file.preview = URL.createObjectURL(file);
      setProfileImage(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        changePassword({
          id: user._id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmNewPassword: passwordData.renewPassword,
        })
      );

      if (changePassword.fulfilled.match(resultAction)) {
        Swal.fire("Success", "Password changed successfully!", "success");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          renewPassword: "",
        });
        navigate("/profile");
      } else {
        throw new Error(resultAction.payload || "Failed to change password");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Profile</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item active">Profile</li>
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
                role="tab"
              >
                Edit Profile
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-change-password"
                role="tab"
              >
                Change Password
              </button>
            </li>
          </ul>

          <div className="tab-content pt-2">
            <div
              className="tab-pane fade show active pt-3"
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
                      src={
                        profileImage
                          ? profileImage.preview
                          : profileData.imgUrl || "assets/img/demo-profile.jpg"
                      }
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      alt="Profile"
                      className="img-fluid rounded"
                    />
                    <div className="pt-2">
                      <input
                        type="file"
                        style={{ display: "none" }}
                        id="profileImageInput"
                        onChange={handleProfileImage}
                      />
                      <a
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          document.getElementById("profileImageInput").click()
                        }
                      >
                        <i className="bi bi-upload"></i> Upload
                      </a>
                      <a
                        className="btn btn-danger btn-sm"
                        onClick={handleRemoveImage}
                      >
                        <i className="bi bi-trash"></i> Remove
                      </a>
                    </div>
                  </div>
                </div>

                {/* Other fields */}
                <div className="row mb-3">
                  <label className="col-md-4 col-lg-3 col-form-label">
                    Full Name
                  </label>
                  <div className="col-md-8 col-lg-9">
                    <input
                      name="fullName"
                      type="text"
                      className="form-control"
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
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            <div
              className="tab-pane fade pt-3"
              id="profile-change-password"
              role="tabpanel"
            >
              <form onSubmit={handleChangePassword}>
                <div className="row mb-3">
                  <label className="col-md-4 col-lg-3 col-form-label">
                    Current Password
                  </label>
                  <div className="col-md-8 col-lg-9">
                    <input
                      name="currentPassword"
                      type="password"
                      className="form-control"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
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
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
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
                      value={passwordData.renewPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    {loading ? "Changing..." : "Change Password"}
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
