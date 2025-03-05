# CVE Database API - Technical Interview Solution

## Author: Sid Sancheti

**Due Date:** Friday, Feb 7 @ 7 PM EST

## Overview

This project is my solution to Securin's technical exam assignment. It is a full-stack web application that fetches, stores, and displays Common Vulnerabilities and Exposures (CVEs) from the National Vulnerability Database (NVD) API using MongoDB, Express.js, React, and Node.js (MERN stack).

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB setup)
- npm (Node Package Manager)

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/sid-sancheti/cve-db.git
cd cve-db
```

#### 2. Set Up the Environment

Create a `.env` file inside the `server` directory and include:

```env
ATLAS_URI=<your_mongodb_connection_string>
DB_NAME=<your_database_name>
COLLECTION_NAME=<your_collection_name>
```

#### 3. Install Dependencies

```bash
cd server
npm install
cd ../client
npm install
```

#### 4. Run the Application

Open two separate terminals:

```bash
# Terminal 1: Start the backend
cd server
npm run dev
```

```bash
# Terminal 2: Start the frontend
cd client
npm start
```

Once the app is running, navigate to `http://localhost:3000/cves/lists/` to view the CVE table.

---

## Project Breakdown

### Backend (`server/`)

#### **1. Database Connection (********`cveDB.js`********\*\*\*\*\*\*\*\*\*\*\*\*)**

- Uses Mongoose to connect to MongoDB Atlas.
- Checks if the database contains any CVEs. If empty, it populates it from the NVD API.
- Logs connection status.

#### **2. Fetching CVEs from NVD API**

- Queries the NVD API for CVEs in batches of 1000.
- Implements retry logic if API returns a 503 error.
- Updates the database every time new data is retrieved.

#### **3. Storing CVEs in MongoDB**

- Uses Mongoose schemas to structure CVE documents.
- Stores essential CVE fields such as `id`, `sourceIdentifier`, `published`, `lastModified`, `vulnStatus`, `descriptions`, `metrics`, `weaknesses`, and `references`.
- Ensures efficient storage and indexing for faster retrieval.

#### **4. API Routes**

- Provides endpoints to fetch CVEs.
- Supports pagination and filtering options for optimized querying.

### Frontend (`client/`)

#### **1. React Application**

- Built with Create React App.
- Uses Axios to make API calls to the backend.
- Displays CVE data in a paginated table.
- Implements filtering and sorting features.

#### **2. UI/UX Considerations**

- Simple, user-friendly interface.
- Loading indicators for API calls.
- Error handling for failed requests.

---

## Development Process

The project started with setting up the initial structure, including a React frontend and a backend server with MongoDB integration. Early commits focused on establishing a connection to the database (aba6365 - Mongo connection established) and setting up routing (ecd9ad7 - Successfully set up routing).



Once the foundational setup was complete, efforts shifted toward implementing key functionality, such as fetching data from the NVD API (6954b3e - Updated NVD API fetch function) and displaying it in a structured table (8055169 - Added table; needs to be populated with the correct info). Pagination and UI enhancements followed (0ae8c49 - Add pagination component and update CVE list handling).



Significant work was done on refining the data-fetching logic and optimizing server performance (3ce4fe2 - Enhance CVE data fetching with sleep function and update dependencies). Further iterations involved improving API requests (fe6d6dd - Update API request URL formatting and increase results per call limit) and debugging database updates (0addfc8 - Finally got the server to update the logs correctly).



Towards the later stages, the project underwent multiple rounds of refactoring to improve code structure and maintainability (5a8a020 - Refactor CVE fetching logic and add total count endpoint, 66b3535 - Refactor database connection and update logic for CVE data population). Documentation was also progressively added (82a5ac1 - Initial API Documentation).

---

## Future Improvements

- Implement a scheduled task to update the database with new CVEs periodically.
- Improve API response time with better indexing.
- Enhance frontend design and add data visualization.

---

## Conclusion

This project evolved through multiple iterations of development, debugging, and optimization. Initial challenges involved setting up a stable API connection and ensuring proper database integration. Later, efforts were focused on refining data handling and enhancing user interaction.



The final version successfully retrieves and displays CVE data, with pagination, structured API responses, and a well-defined database schema. Future improvements could include more robust error handling, performance optimizations, and additional UI refinements.

Thank you for reviewing my project! 🚀

