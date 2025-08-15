import React, { useEffect, useState, useRef } from "react";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  searchCompanies,
} from "../requests/apirequests";
import "../styles/CompaniesList.css";
import { MdOutlineModeEdit, MdDeleteOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [industry, setIndustry] = useState("");
  const [isActive, setIsActive] = useState("");
  const [minAnnualRevenue, setMinAnnualRevenue] = useState("");
  const [maxAnnualRevenue, setMaxAnnualRevenue] = useState("");
  const [tempIndustry, setTempIndustry] = useState("");
  const [tempIsActive, setTempIsActive] = useState("");
  const [tempMinAnnualRevenue, setTempMinAnnualRevenue] = useState("");
  const [tempMaxAnnualRevenue, setTempMaxAnnualRevenue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // "view", "edit", "create"
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    employeeCount: "",
    website: "",
    annualRevenue: "",
    isActive: true,
    description: "",
    email: "",
  });
  const debounceTimer = useRef(null);
  useEffect(() => {
    fetchCompanies(page);
  }, [page, industry, isActive, minAnnualRevenue, maxAnnualRevenue]);

  const fetchCompanies = async (currentPage, searchOverride) => {
    try {
      setLoading(true);
      const data = await getCompanies({
        page: currentPage,
        limit: 10,
        industry: industry || undefined,
        isActive: isActive || undefined,
        minAnnualRevenue: minAnnualRevenue || undefined,
        maxAnnualRevenue: maxAnnualRevenue || undefined,
        searchTerm: searchOverride || searchTerm || undefined, // <-- here
      });
      setCompanies(data.data || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await searchCompanies({ q: value });
        setSuggestions(res.data || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 400);
  };
  const openModal = (mode, company = null) => {
    setModalMode(mode);
    setSelectedCompany(company);
    if (mode === "edit" || mode === "view") {
      setFormData({
        name: company.name,
        industry: company.industry,
        employeeCount: company.employeeCount,
        website: company.website,
        description: company.description || "",
        email: company.email || "",
        annualRevenue: company.annualRevenue || "",
        isActive: company.isActive,
      });
    } else {
      setFormData({
        name: "",
        industry: "",
        employeeCount: "",
        website: "",
        annualRevenue: "",
        description: "",
        email: "",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (modalMode === "edit") {
        await updateCompany(selectedCompany._id, formData);
      } else if (modalMode === "create") {
        await createCompany(formData);
      }
      setShowModal(false);
      fetchCompanies(page);
    } catch (err) {
      alert("Error saving company");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteCompany(selectedCompany._id);
        setShowModal(false);
        fetchCompanies(page);
      } catch {
        alert("Failed to delete");
      }
    }
  };
  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setShowSuggestions(false);
    fetchCompanies(1, name);
  };
  const handleClearFilters = async () => {
    // Reset filters
    setIndustry("");
    setIsActive("");
    setMinAnnualRevenue("");
    setMaxAnnualRevenue("");
    setTempIndustry("");
    setTempIsActive("");
    setTempMinAnnualRevenue("");
    setTempMaxAnnualRevenue("");
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setPage(1);

    try {
      setLoading(true);
      const data = await getCompanies({
        page: 1,
        limit: 10,
      });
      setCompanies(data.data || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-directory">
      <h2 className="company-title">Company Directory</h2>
      <p className="company-subtitle">
        Complete list of all registered companies
      </p>
      <div className="company-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="search-bar"
          />
          {showSuggestions && (
            <ul className="suggestions-dropdown">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => {
                    handleSuggestionClick(item.name), console.log(item.name);
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={handleClearFilters}>clear filters</button>
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <button className="create-btn" onClick={() => openModal("create")}>
          + Create New Company
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <select
            value={tempIndustry}
            onChange={(e) => setTempIndustry(e.target.value)}
          >
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="other">other</option>
          </select>

          <select
            value={tempIsActive}
            onChange={(e) => setTempIsActive(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <input
            type="number"
            placeholder="Min Revenue"
            value={tempMinAnnualRevenue}
            onChange={(e) => setTempMinAnnualRevenue(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Revenue"
            value={tempMaxAnnualRevenue}
            onChange={(e) => setTempMaxAnnualRevenue(e.target.value)}
          />

          <button
            className="apply-filters-btn"
            onClick={() => {
              setIndustry(tempIndustry);
              setIsActive(tempIsActive);
              setMinAnnualRevenue(tempMinAnnualRevenue);
              setMaxAnnualRevenue(tempMaxAnnualRevenue);
              setPage(1);
            }}
          >
            Apply Filters
          </button>
        </div>
      )}

      <div className="company-table">
        <div className="company-table-header">
          <span>COMPANY</span>
          <span>INDUSTRY</span>
          <span>EMPLOYEES</span>
          <span>WEBSITE</span>
          <span>ACTIONS</span>
        </div>
        {loading ? (
          <p>Loading companies...</p>
        ) : companies.length > 0 ? (
          companies.map((company) => (
            <div className="company-table-row" key={company._id}>
              <div className="company-info">
                <img
                  src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${company._id}`}
                  alt={company.name}
                  className="company-avatar"
                />
                <div>
                  <div className="company-name">{company.name}</div>
                  <div className="company-id">{company._id.slice(0, 8)}...</div>
                </div>
              </div>
              <div>{company.industry}</div>
              <div>{company.employeeCount}</div>
              <div>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="company-link"
                >
                  {company.website}
                </a>
              </div>
              <div>
                <button
                  onClick={() => openModal("view", company)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No companies found.</p>
        )}
      </div>

      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalMode === "view" && "Company Details"}
                {modalMode === "edit" && "Edit Company"}
                {modalMode === "create" && "Create New Company"}
              </h3>
              {modalMode === "view" && (
                <div className="modal-actions">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => openModal("edit", selectedCompany)}
                    title="Edit Company"
                  >
                    <MdOutlineModeEdit />
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={handleDelete}
                    title="Delete Company"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              )}

              <button className="close-btn" onClick={() => setShowModal(false)}>
                <RxCross2 size={22} color="red" />
              </button>
            </div>

            <div className="modal-body">
              {modalMode === "view" ? (
                <>
                  <div className="modal-view-header">
                    <div>
                      <span className="modal-company-name">
                        {selectedCompany.name}
                      </span>
                      <span
                        className={`status-badge ${
                          selectedCompany.isActive
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {selectedCompany.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedCompany.website}
                    </a>
                  </div>

                  <div className="modal-view-grid">
                    <div className="detail-item">
                      <span className="detail-label">Industry</span>
                      <span className="detail-value">
                        {selectedCompany.industry}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Employees</span>
                      <span className="detail-value">
                        {selectedCompany.employeeCount}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">
                        {selectedCompany.email}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Annual Revenue</span>
                      <span className="detail-value">
                        ₹{selectedCompany.annualRevenue}
                      </span>
                    </div>
                    <div className="detail-item full-width">
                      <span className="detail-label">Description</span>
                      <span className="detail-value description-text">
                        {selectedCompany.description}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Created At</span>
                      <span className="detail-value">
                        {new Date(selectedCompany.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Last Updated</span>
                      <span className="detail-value">
                        {new Date(selectedCompany.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-field">
                    <label htmlFor="name">Company Name</label>
                    <input
                      id="name"
                      placeholder="e.g., FLM.."
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="industry">Industry</label>
                    <select
                      id="industry"
                      name="industry"
                      required
                      value={formData.industry || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                    >
                      <option value="">-- Select Industry --</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="other">other</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="employeeCount">Employees</label>
                    <input
                      id="employeeCount"
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.employeeCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employeeCount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="annualRevenue">Annual Revenue</label>
                    <input
                      id="annualRevenue"
                      type="number"
                      placeholder="e.g., 10000000"
                      value={formData.annualRevenue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          annualRevenue: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      placeholder="e.g., https://innovate.com"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Contact Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g., contact@innovate.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field full-width">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      rows="4"
                      placeholder="description of the company..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="form-field">
                    <label htmlFor="isActive">Status</label>
                    <select
                      id="isActive"
                      value={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.value === "true",
                        })
                      }
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {modalMode !== "view" && (
              <div className="modal-footer">
                <button onClick={handleSave} className="save-btn">
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompaniesList;
