import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import StaticBackground from "./Components/StaticBackground";
import { useSelector } from "react-redux";
import Register from "../Register";
import Login from "../Login";
import styles from "./Problems.module.css";
import Pagination from "./Components/Pagination";
import {
  PiSortAscendingLight,
  PiSortDescendingLight,
} from "react-icons/pi";
import {
  FiSearch,
  FiFilter,
  FiCode,
  FiCheckSquare,
} from "react-icons/fi";
import axios from "axios";
import api, { endpoint } from '../../utils/apiClient';
import useDebounce from './Hooks/useDebounce';
import { Outlet } from "react-router-dom";

const Problems = () => {
  const RegisterModal = useSelector((state) => state.modal.showRegisterModal);
  const LoginModal = useSelector((state) => state.modal.showLoginModal);

  const [currentPage, setCurrentPage] = useState(0);
  const [problemsData, setProblemsData] = useState([]);
  const [allProblems, setAllProblems] = useState([]);

  const url = endpoint('/api/problems');

  // Fetch all problems on mount
  useEffect(() => {
    api.get('/api/problems').then((res) => {
      setProblemsData(res.data);
      setAllProblems(res.data);
    });
  }, []);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");

  // Debounce all filters
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const debouncedSortOrder = useDebounce(sortOrder, 400);
  const debouncedStatusFilter = useDebounce(statusFilter, 400);
  const debouncedLanguageFilter = useDebounce(languageFilter, 400);

  // Fetch problems whenever any filter changes
  useEffect(() => {
    const params = [];
    if (debouncedSearchTerm.trim()) params.push(`search=${encodeURIComponent(debouncedSearchTerm)}`);
    if (debouncedSortOrder) params.push(`sort=${debouncedSortOrder}`);
    if (debouncedStatusFilter && debouncedStatusFilter !== "all") params.push(`status=${debouncedStatusFilter}`);
    if (debouncedLanguageFilter && debouncedLanguageFilter !== "all") params.push(`language=${debouncedLanguageFilter}`);

    const queryString = params.length ? `?${params.join("&")}` : "";

    api
      .get(`/api/problems${queryString}`)
      .then((res) => setProblemsData(res.data))
      .catch((err) => console.error(err));
  }, [debouncedSearchTerm, debouncedSortOrder, debouncedStatusFilter, debouncedLanguageFilter, allProblems]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSortOrder("asc");
    setStatusFilter("all");
    setLanguageFilter("all");
  };

  const PAGE_SIZE = 4;
  const totalPages = Math.ceil(problemsData.length / PAGE_SIZE);
  const page_arr = new Array(totalPages).fill(0);

  return (
    <>
      <div className={styles.problemsPage}>
        <StaticBackground />
        <div style={{ position: "relative", zIndex: 10 }}>
          <Navbar />
          {RegisterModal && <Register />}
          {LoginModal && <Login />}

          <div className={styles.problemsContent}>
            <div className={styles.problemsContainer}>
              <header style={{ color: "var(--primary-color)" }}>
                <h1>Problems</h1>
              </header>

              <div className={styles.problemsWrapper}>
                <Pagination
                  data={problemsData}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  PAGE_SIZE={PAGE_SIZE}
                />
              </div>

              <div className="pagination-container">
                {page_arr.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`pagination-number ${
                      currentPage === index ? "active" : ""
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              
            </div>

            {/* Filters */}
            <div className={styles.filtersContainer}>
              <header>
                <h1>Filters</h1>
              </header>
              <section className={styles.filtersSection}>
                {/* Search */}
                <div className={styles.filterSearch}>
                  <div className={styles.filterSearchHeader}>
                    <FiSearch className={styles.filterIcon} />
                    <h3 className={styles.filterText}>Search Problem</h3>
                  </div>
                  <input
                  className={styles.filterSearchInput}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search Problem"
                  />
                </div>

                <div className={styles.filterDivider}></div>

                {/* Sort */}
                <div className={styles.filterRow}>
                  <div className={styles.filterSortBy}>
                    <div className={styles.filterSortByHeader}>
                      <h3 className={styles.filterText}>Difficulty</h3>
                      {sortOrder === "asc" ? (
                        <PiSortAscendingLight className={styles.filterIcon} />
                      ) : (
                        <PiSortDescendingLight className={styles.filterIcon} />
                      )}
                    </div>
                    <select
                      className={styles.sortDropdown}
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="asc">Easy → Hard</option>
                      <option value="desc">Hard → Easy</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className={styles.filterStatus}>
                    <div className={styles.filterStatusHeader}>
                      <FiCheckSquare className={styles.filterIcon} />
                      <h3 className={styles.filterText}>Status</h3>
                    </div>
                    <select
                      className={styles.statusDropdown}
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="solved">Solved</option>
                      <option value="unsolved">Unsolved</option>
                      <option value="attempted">Attempted</option>
                    </select>
                  </div>
                </div>

                <div className={styles.filterDivider}></div>

                {/* Language */}
                <div className={styles.filterLanguage}>
                  <div className={styles.filterLanguageHeader}>
                    <FiCode className={styles.filterIcon} />
                    <h3 className={styles.filterText}>Filter by Language</h3>
                  </div>
                  <select
                    className={styles.languageDropdown}
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                  >
                    <option value="all">All Languages</option>
                    <option value="html">HTML</option>
                    <option value="javascript">JavaScript</option>
                    <option value="react">React</option>
                  </select>
                </div>

                <div className={styles.filterDivider}></div>

                <button
                  className={styles.clearFiltersBtn}
                  onClick={clearAllFilters}
                >
                  <FiFilter className={styles.filterIcon} />
                  Clear Filters
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Outlet/>
    </>
  );
};

export default Problems;
