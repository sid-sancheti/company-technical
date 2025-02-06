/**
 * Combines the components to make the main page of the website.
 * 
 * @author Sid Sancheti
 */

import React from 'react'
import CVEList from '../components/CVEList'
import Dropdown from '../components/Dropdown'
// import Pagination from '../components/Pagination'

function MainPage() {
    return (
        <div>
            <CVEList />
            <Dropdown />
        </div>
    );
};

export default MainPage;