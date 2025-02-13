import React from "react";

function CveTable({ cves, onRowClick }) {
  return (
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
          <tr key={cve.id} onClick={() => onRowClick(cve.id)}>
            <td>{cve.id}</td>
            <td>{cve.sourceIdentifier}</td>
            <td>{cve.published}</td>
            <td>{cve.lastModified}</td>
            <td>{cve.vulnStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CveTable;