import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CVEList.css";
import Pagination from "../components/Pagination";
import ResultsPerPageDropdown from "../components/ResultsPerPageDropdown";
import CveTable from "../components/CveTable";

const API_BASE_URL = "/api/cves"; // Centralize API base URL

function MainPage() {
  const [cves, setCves] = useState([]);
  const [totalCves, setTotalCves] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  // Because the resultsPerPage and currentPage values
  // effect what is displayed, we need to refetch the data
  // every time these values change.
  //
  // Using the powerful useEffect hook, we can fetch the data
  // when values change.
  useEffect(() => {
    const fetchCves = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Clear any previous errors

      // Ensure that the initial api is /api/cves/
      try {
        const response = await axios.get(`${API_BASE_URL}/`, {
          params: {
            items: resultsPerPage,
            page: currentPage,
          },
        });
        setCves(response.data.cves);
      } catch (err) {
        console.error("Error fetching CVEs:", err.message);
        setError(err.message); // Set the error message
      } finally {
        setLoading(false); // Set loading to false after fetch, regardless of success/failure
      }
    };

    fetchCves();
  }, [resultsPerPage, currentPage]);  // The function will be called every time one of these values changes

  /**
   * Get the total number of documents in the collection.
   */
  const fetchTotalCves = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/totalCount`);
      setTotalCves(response.data.count);
    } catch (err) {
      console.error("Error fetching total CVEs:", err.message);
      setError(err.message); // Set the error message
    }
  };
  fetchTotalCves();

  const handleRowClick = (cveId) => {
    navigate(`/cves/${cveId}`);
  };

  const handleResultsPerPageChange = (newResultsPerPage) => {
    setResultsPerPage(newResultsPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalCves / resultsPerPage);

  if (loading) {
    return <div>Loading CVE data...</div>; // Display loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-h1">CVE LIST</h1>
      </header>
      <p>Total Records: {totalCves}</p>

      <ResultsPerPageDropdown
        resultsPerPage={resultsPerPage}
        onChange={handleResultsPerPageChange}
      />

      <CveTable cves={cves} onRowClick={handleRowClick} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default MainPage;