import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CVEList.css";

/**
 * Returns a table of CVEs with the specified page number and results per page.
 * 
 * @returns A table of CVEs with the following columns:
 * - CVE ID
 * - Identifier
 * - Published Date
 * - Last Modified Date
 * - Status
 */
function CVEList() {
  const [cves, setCves] = useState([]);                     // Initialize with empty array
  const [totalCves, setTotalCves] = useState(0);            // Initialized to 0
  const [resultsPerPage, setResultsPerPage] = useState(10); // Initialized to 10 because it is the default value
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCves = async () => {
      try {
        const response = await axios.get("/api/cves"); // Fetch CVEs from your backend API
        setCves(response.data.docs); // Update state with fetched CVEs
        setTotalCves(response.data.totalDocs); // Update total CVEs count
        setResultsPerPage(response.data.limit); // Update resultsPerPage from the response
      } catch (error) {
        console.error("Error fetching CVEs:", error);
      }
    };

    fetchCves();
  },); // Empty dependency array ensures this runs only once on component mount

  const handleRowClick = (cveId) => {
    navigate(`/cves/${cveId}`); // Navigate to the CVE details page
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-h1">CVE LIST</h1>
      </header>
      <p>Total Records: {totalCves}</p> {/* Display total records */}
      <table>
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>Identifier</th>
            <th>Published Date</th>
            <th>Last Modified Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cves.map((cve) => (
            <tr key={cve.cveId} onClick={() => handleRowClick(cve.cveId)}>
              <td>{cve.cveId}</td>
              <td>{cve.sourceIdentifier}</td>
              <td>{new Date(cve.published).toLocaleDateString()}</td>
              <td>{new Date(cve.lastModified).toLocaleDateString()}</td>
              <td>{cve.vulnStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CVEList;