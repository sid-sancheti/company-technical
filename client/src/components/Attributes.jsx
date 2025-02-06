/**
 * This component houses the results-per-page drop-down menu. This will affect the pagination
 * and the table view.
 */
import React, { useState } from "react";

function MyDropdown() {
  const [selectedValue, setSelectedValue] = useState(10); // Default value

  const handleChange = (event) => {
    setSelectedValue(parseInt(event.target.value, 10)); // Update state
  };

  return (
    <div>
      {/* Create the dropdown menu that controls the number of results per page. */}
      <label htmlFor="number-select">Select a number:</label>
      <select id="number-select" value={selectedValue} onChange={handleChange}>
        <option value={10}>10</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <p>Selected value: {selectedValue}</p>
    </div>
  );
}

export default MyDropdown;
