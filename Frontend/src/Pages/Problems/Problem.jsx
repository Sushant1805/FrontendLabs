import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import StaticBackground from "./Components/StaticBackground";
import { useSelector } from "react-redux";
import Register from "../Register";
import Login from "../Login";
import styles from "./Problems.module.css";
import ProblemsCard from "./Components/ProblemsCard";
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
import Pagination from "./Components/Pagination";

const Problems = () => {
  const [problemsData, setProblemsData] = useState([]);
  const RegisterModal = useSelector((state) => state.modal.showRegisterModal);
  const LoginModal = useSelector((state) => state.modal.showLoginModal);
  const [currentPage, setCurrentPage] = useState(0);

  const url = "http://localhost:5000/api/problems";

  useEffect(() => {
    axios.get(url).then((res) => {
      setProblemsData(res.data);
      console.log(res.data);
    });
  }, []);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'solved', 'unsolved', 'attempted'
  const [languageFilter, setLanguageFilter] = useState("all"); // 'all', 'html', 'javascript', 'react'

  // Handlers for filters
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (e) => setSortOrder(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleLanguageChange = (e) => setLanguageFilter(e.target.value);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSortOrder("asc");
    setStatusFilter("all");
    setLanguageFilter("all");
  };

  const PAGE_SIZE = 4; // items per page
  const totalPages = Math.ceil(problemsData.length / PAGE_SIZE);
  const page_arr = new Array(totalPages).fill(0);

  return (
    <div className={styles.problemsPage}>
      {/* Background */}
      <StaticBackground />

      {/* Foreground */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />
        {RegisterModal && <Register />}
        {LoginModal && <Login />}

        {/* Problems Content */}
        <div className={styles.problemsContent}>
          <div className={styles.problemsContainer}>
            <header style={{ color: "var(--primary-color)" }}>
              <h1>Problems</h1>
            </header>

            {/* Problems List */}
            <div className={styles.problemsWrapper}>
              <Pagination
                data={problemsData}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                PAGE_SIZE={PAGE_SIZE}
              />
            </div>
            {/* Pagination */}
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
              {/* Search Filter */}
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
                  placeholder="Enter Problem Name"
                />
              </div>

              <div className={styles.filterDivider}></div>

              {/* Sort & Status */}
              <div className={styles.filterRow}>
                {/* Sort by Difficulty */}
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
                    onChange={handleSortChange}
                  >
                    <option value="asc">Easy → Hard</option>
                    <option value="desc">Hard → Easy</option>
                  </select>
                </div>

                {/* Filter by Status */}
                <div className={styles.filterStatus}>
                  <div className={styles.filterStatusHeader}>
                    <FiCheckSquare className={styles.filterIcon} />
                    <h3 className={styles.filterText}>Status</h3>
                  </div>
                  <select
                    className={styles.statusDropdown}
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
                    <option value="all">All</option>
                    <option value="solved">Solved</option>
                    <option value="unsolved">Unsolved</option>
                    <option value="attempted">Attempted</option>
                  </select>
                </div>
              </div>

              <div className={styles.filterDivider}></div>

              {/* Filter by Language */}
              <div className={styles.filterLanguage}>
                <div className={styles.filterLanguageHeader}>
                  <FiCode className={styles.filterIcon} />
                  <h3 className={styles.filterText}>Filter by Language</h3>
                </div>
                <select
                  className={styles.languageDropdown}
                  value={languageFilter}
                  onChange={handleLanguageChange}
                >
                  <option value="all">All Languages</option>
                  <option value="html">HTML</option>
                  <option value="javascript">JavaScript</option>
                  <option value="react">React</option>
                </select>
              </div>

              <div className={styles.filterDivider}></div>

              {/* Clear Filters */}
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
  );
};

export default Problems;
