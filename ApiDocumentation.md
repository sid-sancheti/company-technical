# API Documentation

## Base URL

```
http://localhost:5000/api/cves
```

---

## Endpoints

### 1. Get a List of CVEs (Paginated)

**Endpoint:**

```
GET /api/cves/
```

**Description:** Retrieves a paginated list of CVEs from the database.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| items | int | No | Number of CVEs per page (default: 10) |
| page | int | No | Page number to retrieve (default: 1) |

**Response:**

```json
{
  "cves": [
    {
      "id": "CVE-XXXX-YYYY",
      "published": "2024-03-01T12:00:00Z",
      "lastModified": "2024-03-02T12:00:00Z",
      "vulnStatus": "Analyzed",
      "descriptions": [...],
      "metrics": {...},
      "weaknesses": [...],
      "configurations": [...],
      "references": [...]
    }
  ],
  "pagination": {
    "total": 1000,
    "page": 1,
    "items": 10
  }
}
```

**Error Responses:**

- `404 Not Found` - No CVEs found.
- `500 Internal Server Error` - Database error.

---

### 2. Get a Single CVE by ID

**Endpoint:**

```
GET /api/cves/cve/:cveId
```

**Description:** Retrieves details of a specific CVE using its `cveId`.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cveId | String | Yes | The CVE ID to look up |

**Response:**

```json
{
  "id": "CVE-XXXX-YYYY",
  "published": "2024-03-01T12:00:00Z",
  "lastModified": "2024-03-02T12:00:00Z",
  "vulnStatus": "Analyzed",
  "descriptions": [...],
  "metrics": {...},
  "weaknesses": [...],
  "configurations": [...],
  "references": [...]
}
```

**Error Responses:**

- `404 Not Found` - CVE not found.
- `500 Internal Server Error` - Database error.

---

### 3. Get Total Number of CVEs

**Endpoint:**

```
GET /api/cves/totalCount
```

**Description:** Retrieves the total count of CVEs in the database.

**Response:**

```json
{
  "count": 12345
}
```

**Error Responses:**

- `500 Internal Server Error` - Database error.

---

## Data Model (CVE Schema)

### **CVE Object**

| Field          | Type   | Description                        |
| -------------- | ------ | ---------------------------------- |
| id             | String | Unique CVE identifier              |
| published      | String | Date published                     |
| lastModified   | String | Date last modified                 |
| vulnStatus     | String | Vulnerability status               |
| cveTags        | Array  | List of tags                       |
| descriptions   | Array  | Array of description objects       |
| metrics        | Object | Object containing CVSS metric data |
| weaknesses     | Array  | Array of weaknesses                |
| configurations | Array  | Array of affected configurations   |
| references     | Array  | Array of external reference links  |

### **CVSS Metric V2 Object**

| Field               | Type   | Description          |
| ------------------- | ------ | -------------------- |
| source              | String | Source of the metric |
| type                | String | Type of metric       |
| baseSeverity        | String | Base severity level  |
| exploitabilityScore | Number | Exploitability score |
| impactScore         | Number | Impact score         |

### **Description Object**

| Field | Type   | Description      |
| ----- | ------ | ---------------- |
| lang  | String | Language code    |
| value | String | Description text |

### **Configuration Object**

| Field | Type  | Description             |
| ----- | ----- | ----------------------- |
| nodes | Array | Array of affected nodes |

### **Reference Object**

| Field  | Type   | Description         |
| ------ | ------ | ------------------- |
| url    | String | Reference URL       |
| source | String | Source of reference |

---

## Security Considerations

- **Rate Limiting:** API requests are limited to 100 requests per 15 minutes per IP to prevent abuse.
- **CORS:** Configured to restrict cross-origin requests.
- **Helmet Middleware:** Used to enhance security by setting HTTP headers.
- **Content Security Policy:** Restricts resource loading to prevent XSS attacks.
- **Input Validation:** All incoming data is validated to prevent injection attacks.

---

## Error Handling

| Status Code               | Meaning                               |
| ------------------------- | ------------------------------------- |
| 404 Not Found             | The requested resource was not found. |
| 500 Internal Server Error | An error occurred on the server side. |

---

## Future Improvements

- Implement duplicate CVE detection and removal.
- Improve API performance with indexing and caching.
- Add authentication for protected endpoints.
- Introduce advanced search functionality for CVEs.
