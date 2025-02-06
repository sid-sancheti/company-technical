import React from 'react';
import '../styles/CVEList.css';

function Table() {
  return (
    <div className="App">
    <header className="App-header">
      <h1 className="App-h1">CVE LIST</h1>
      <p>Total Records: 1234</p>
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
    </header>
    </div>
  );
}

export default Table;