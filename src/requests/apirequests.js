import axios from "axios";

const API_BASE = "http://localhost:1337/api/v1/companies"; // change to your backend URL

// Search companies with filters
export const searchCompanies = async (params) => {
  try {
    const res = await axios.get(`${API_BASE}/search`, { params });
    return res.data;
  } catch (err) {
    console.error("Error searching companies:", err);
    throw err;
  }
};

// Create a new company
export const createCompany = async (companyData) => {
  try {
    const res = await axios.post(API_BASE, companyData);
    return res.data;
  } catch (err) {
    console.error("Error creating company:", err);
    throw err;
  }
};

// Get all companies
export const getCompanies = async (query = {}) => {
  try {
    const res = await axios.get(API_BASE, { params: query });
    return res.data;
  } catch (err) {
    console.error("Error fetching companies:", err);
    throw err;
  }
};

// Get company by ID
export const getCompanyById = async (id) => {
  try {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching company:", err);
    throw err;
  }
};

// Update company
export const updateCompany = async (id, updateData) => {
  try {
    const res = await axios.put(`${API_BASE}/${id}`, updateData);
    return res.data;
  } catch (err) {
    console.error("Error updating company:", err);
    throw err;
  }
};

// Delete company
export const deleteCompany = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting company:", err);
    throw err;
  }
};
