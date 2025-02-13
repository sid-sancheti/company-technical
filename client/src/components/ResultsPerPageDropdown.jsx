import React from "react";

function ResultsPerPageDropdown({ resultsPerPage, onChange }) {
  return (
    <div>
      <label htmlFor="resultsPerPage">Results per page:</label>
      <select
        id="resultsPerPage"
        value={resultsPerPage}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      >
        <option value={10}>10</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
}

export default ResultsPerPageDropdown;