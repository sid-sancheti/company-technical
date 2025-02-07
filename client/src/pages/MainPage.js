/**
 * Combines the components to make the main page of the website.
 *
 * @author Sid Sancheti
 */

import React from "react";
import CVEList from "../components/CVEList";

function MainPage() {
  return (
    <div>
      <CVEList />
    </div>
  );
}

export default MainPage;
