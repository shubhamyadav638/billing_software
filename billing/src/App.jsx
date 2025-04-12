import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import Dashboard from "./components/admin/Dashboard";
import Login from "./components/admin/pages/Login";
import Category from "./components/admin/pages/Category";
import AllItem from "./components/admin/pages/AllItem";
import AddBills from "./components/admin/pages/Addbills";
import AllBills from "./components/admin/pages/AllBills";

function Layout({ children, menuToggle, setMenuToggle }) {
  const location = useLocation();
  const hideLayout = ["/", "/register"].includes(location.pathname);

  return (
    <div className={menuToggle ? "toggle-sidebar" : ""}>
      {!hideLayout && (
        <>
          <Header setMenuToggle={setMenuToggle} menuToggle={menuToggle} />
          <Sidebar />
        </>
      )}
      {children}
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  const [menuToggle, setMenuToggle] = useState(false);

  return (
    <BrowserRouter>
      <Layout menuToggle={menuToggle} setMenuToggle={setMenuToggle}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/all-items" element={<AllItem />} />
          <Route path="/category" element={<Category />} />
          <Route path="/all-bills" element={<AllBills />} />
          <Route path="/add-bills" element={<AddBills />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
