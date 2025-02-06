import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import "./styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/cves/">   {/* Sets the root path to /cves/ */}
        <App />                         {/* Displays any page*/}
    </BrowserRouter>
  </React.StrictMode>
);
