import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../redux/slice/user.slice";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [loginMessage, setLoginMessage] = useState({ type: "", text: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const validateForm = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email address.";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    try {
      await dispatch(userLogin(formData)).unwrap();
      setLoginMessage({ type: "success", text: "Login successful!" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      setLoginMessage({ type: "error", text: error || "Login failed!" });
    }
  };

  return (
    <main>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-4">
                  <span className="logo d-flex align-items-center w-auto">
                    <img src="assets/img/logo.png" alt="" />
                    <span className="d-none d-lg-block">NiceAdmin</span>
                  </span>
                </div>
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">
                        Login to Your Account
                      </h5>
                      <p className="text-center small">
                        Enter your email & password to login
                      </p>
                    </div>
                    <form
                      onSubmit={handleSubmit}
                      className="row g-3 needs-validation"
                    >
                      <div className="col-12">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${
                            formErrors.email ? "is-invalid" : ""
                          }`}
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {formErrors.email && (
                          <div className="invalid-feedback">
                            {formErrors.email}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          className={`form-control ${
                            formErrors.password ? "is-invalid" : ""
                          }`}
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        {formErrors.password && (
                          <div className="invalid-feedback">
                            {formErrors.password}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="remember"
                            id="rememberMe"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="rememberMe"
                          >
                            Remember me
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <button
                          className="btn btn-primary w-100"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Logging in..." : "Login"}
                        </button>
                        {loginMessage.text && (
                          <div
                            className={`mt-3 text-center alert alert-${
                              loginMessage.type === "success"
                                ? "success"
                                : "danger"
                            } alert-dismissible fade show`}
                            role="alert"
                          >
                            {loginMessage.text}
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
