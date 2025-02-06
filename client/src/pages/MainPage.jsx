/**
 * Combines the components to make the main page of the website.
 * 
 * @author Sid Sancheti
 * @version 1.0.0
 */

import React from 'react'
import CVEList from '../components/CVEList'
import Attributes from '../components/Attributes'

// TODO: Figure out a way to send the state from Attributes to CVEList
function MainPage() {
    return (
        <div>
            <CVEList />
            <Attributes />
        </div>
    );
};

export default MainPage;