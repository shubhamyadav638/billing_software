import axios from "axios";
const userLogin = "http://localhost:8000/api/v1/user/login";
const addcategory = "http://localhost:8000/api/v1/item/addcategory";
const getcategory = "http://localhost:8000/api/v1/item/getcategories";
const deleteCategory = "http://localhost:8000/api/v1/item/category";
const editCategory = "http://localhost:8000/api/v1/item/category";

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
