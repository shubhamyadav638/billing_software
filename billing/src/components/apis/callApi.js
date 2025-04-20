import axios from "axios";
const userLogin = "http://localhost:8000/api/v1/user/login";
const userUpdate = "http://localhost:8000/api/v1/user/update";
const addcategory = "http://localhost:8000/api/v1/categoryitem/addcategory";
const getcategory = "http://localhost:8000/api/v1/categoryitem/getcategories";
const deleteCategory = "http://localhost:8000/api/v1/categoryitem/category";
const editCategory = "http://localhost:8000/api/v1/categoryitem/category";
const additem = "http://localhost:8000/api/v1/items/additem";
const getitem = "http://localhost:8000/api/v1/items/allitem";
const deleteitem = "http://localhost:8000/api/v1/items/deleteitem";
const edititem = "http://localhost:8000/api/v1/items/editItem";
const addBill = "http://localhost:8000/api/v1/bill/addbills";
const getBill = "http://localhost:8000/api/v1/bill/getbill";
const cancleBill = "http://localhost:8000/api/v1/bill/cancel";

//! ==========  Get bill and Billitems api ========
export const getBillsAPI = async () => {
  try {
    const response = await axios.get(getBill);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to get bills");
  }
};

//! ==========  Add bill api ========
export const addBillAPI = async (billData) => {
  const response = await axios.post(addBill, billData);
  return response.data;
};

//!------------- add item api --------
export const addItemAPI = async (itemData, file) => {
  const formData = new FormData();
  formData.append("itemName", itemData.itemName);
  formData.append("price", itemData.price);
  formData.append("unit", itemData.unit);
  formData.append("category", itemData.category);
  formData.append("gst", itemData.gst);
  formData.append("img", file);

  return axios.post(`${additem}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
//!------------- edit item api --------
export const editItemAPI = async (id, itemData, file) => {
  const formData = new FormData();
  formData.append("itemName", itemData.itemName);
  formData.append("price", itemData.price);
  formData.append("unit", itemData.unit);
  formData.append("category", itemData.category);
  formData.append("gst", itemData.gst);
  if (file) {
    formData.append("img", file);
  }

  return axios.put(`${edititem}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//!------------- get item api --------
export const getAllItemsAPI = async () => {
  return axios.get(`${getitem}`);
};

//!------------- delete item api --------
export const deleteItemAPI = async (id) => {
  return axios.delete(`${deleteitem}/${id}`);
};

//!------------- add category api --------

export const addCategoryAPI = async (formData) => {
  const response = await axios.post(addcategory, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

//!------------- Edite Category ----------
export const editCategoryAPI = async (id, formData) => {
  const response = await axios.put(`${editCategory}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

//!------------- Delete Category ----------
export const deleteCategoryAPI = async (id) => {
  const response = await axios.delete(`${deleteCategory}/${id}`);
  return response.data;
};

//!------------- Get category ----------
export const getCategoriesAPI = async () => {
  const res = await axios.get(getcategory);
  return res.data;
};

//!------------- user  login ----------
export const login = async (credentials) => {
  try {
    const response = await axios.post(userLogin, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
//!------------- user  update profile ----------
export const updateUserProfileAPI = async (id, profileData) => {
  const response = await axios.put(`${userUpdate}/${id}`, profileData);
  return response.data;
};

//!-------------   CancelBill  ----------
export const cancelBillAPI = async (id) => {
  try {
    const response = await axios.put(`${cancleBill}/${id}`);
    return response.data;
  } catch (e) {
    throw new Error("Error canceling the bill");
  }
};
