import React from 'react';
import '../styles/table.css';

function Table() {
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
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
          <td>Data 3</td>
        </tr>
        <tr>
          <td>Data 4</td>
          <td>Data 5</td>
          <td>Data 6</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Table;