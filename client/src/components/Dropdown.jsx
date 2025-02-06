/**
 * This component houses the results-per-page drop-down menu. This will affect the pagination
 * and the table view.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";

function MyDropdown() {
  const [selectedValue, setSelectedValue] = useState(10);

  const handleChange = (event) => {
    setSelectedValue(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    const sendSelectedValue = async () => {
      try {
        await axios.post("/api/cves/set-results-per-page", {
          resultsPerPage: selectedValue,
        });
      } catch (error) {
        console.error("Error sending selected value:", error);
      }
    };

    sendSelectedValue();
  }, [selectedValue]); // Run this effect whenever selectedValue changes

  return (
    <div className="dropdown">
      <label htmlFor="number-select">
        <strong>Rows per page: </strong>
      </label>
      <select id="number-select" value={selectedValue} onChange={handleChange}>
        <option value={10}>10</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
}

export default MyDropdown;
