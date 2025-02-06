import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import Table from "./components/CVEList";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <p>Count: 1234</p>
    <Table />
  </React.StrictMode>
);
