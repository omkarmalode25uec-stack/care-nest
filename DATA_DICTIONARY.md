# KumbhStay — Data Dictionary (MongoDB Database: `kumbhstay`)

This document defines the schema, field specifications, data types, constraints, GeoJSON geospatial specifications, normalization rules, and geographic provenance for the **KumbhStay** accommodation and pilgrim assistance platform.

---

## Geographic Scope Policy & Provenance Rules

| Parameter | Allowed Values | Usage & Filtering Policy |
| :--- | :--- | :--- |
| `locationScope` | `"prayagraj"`, `"nashik"`, `"generic"`, `"unknown"` | Designates the actual geographical jurisdiction of the record. Production pilgrim searches strictly filter `locationScope: "prayagraj"`. |
| `dataStatus` | `"verified"`, `"unverified"`, `"reference"`, `"demo"` | Designates the operational state of the record. External Nashik reference data is tagged `"reference"`. |
| `source` | `{ file: String, originalId: String }` | Preserves source provenance without mutating the origin file or identifier. |

---

## 1. Collection: `properties`

### Purpose
Stores all accommodation listings for Kumbh Mela pilgrims, including hotels, hostels, PGs, and homestays.

| Field Name | Data Type | Optional / Required | Default | Source / Provenance | Description & Normalization Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Required (Auto) | Auto | MongoDB | Primary key. |
| `name` | String | Required | — | Source / Owner | Property title, trimmed and normalized. |
| `description` | String | Optional | `""` | Source / Owner | Detailed property description. |
| `propertyType` | String | Required | — | Source / Owner | Standardized enum: `hotel`, `hostel`, `pg`, `homestay`. |
| `address` | String | Required | — | Source / Owner | Full street address. |
| `city` | String | Required | — | Source / Owner | City (e.g., `Prayagraj` or `Nashik`). |
| `state` | String | Required | — | Source / Owner | State (e.g., `Uttar Pradesh` or `Maharashtra`). |
| `country` | String | Required | `"India"` | Constant | Country name. |
| `location` | GeoJSON Point | Optional | — | GPS / Geocoding | `{ type: "Point", coordinates: [longitude, latitude] }`. Longitude strictly $[-180, 180]$, Latitude $[-90, 90]$. |
| `pricePerNight` | Number | Required | — | Source / Owner | Nightly tariff in INR (numeric, non-negative). Never fabricated. |
| `amenities` | Array of Strings | Optional | `[]` | Source / Owner | Normalized tokens: `wifi`, `ac`, `water`, `hotWater24h`, `parking`, `attachedBathroom`. |
| `occupantPreferences`| Array of Strings | Optional | `[]` | Source / Owner | Normalized tokens: `family`, `female`, `bachelor`, `children`, `seniorCitizen`. |
| `images` | Array of Strings | Optional | `[]` | Source / Owner | Validated HTTP/HTTPS image URLs. |
| `googlePlaceId` | String | Optional | `null` | Google Places API | External Google Place identifier. |
| `googleRating` | Number | Optional | `null` | Google Places API | External rating float ($1.0$ to $5.0$). |
| `googleReviewCount` | Number | Optional | `null` | Google Places API | Integer count of Google reviews. |
| `verificationStatus` | String | Required | `"pending"` | Admin Audit | Enum: `draft`, `pending`, `verified`, `rejected`, `suspended`. |
| `ownerVerified` | Boolean | Required | `false` | Admin Audit | Whether the owner's legal identity is verified. |
| `propertyVerified` | Boolean | Required | `false` | Admin Audit | Whether the physical premises and ownership documents are verified. |
| `locationVerified` | Boolean | Required | `false` | Admin Audit | Whether on-ground GPS coordinates and ghat distance are verified. |
| `photoVerified` | Boolean | Required | `false` | Admin Audit | Whether exterior/interior photos match physical site. |
| `trustScore` | Number | Required | `0` | Algorithmic Score | Computed Trust Score ($0$–$100$) based on audit items. |
| `lastVerifiedAt` | Date | Optional | `null` | Admin Audit | UTC timestamp of last successful physical inspection. |
| `locationScope` | String | Required | — | Geographic Tag | Strict enum: `"prayagraj"`, `"nashik"`, `"generic"`, `"unknown"`. |
| `dataStatus` | String | Required | `"reference"` | Pipeline | Enum: `"verified"`, `"unverified"`, `"reference"`, `"demo"`. |
| `source` | Object | Required | — | Pipeline | Audit object: `{ file: String, originalId: String }`. |
| `createdAt` | Date | Required | Auto | System | Creation UTC timestamp. |
| `updatedAt` | Date | Required | Auto | System | Modification UTC timestamp. |

### Indexes
- 2dsphere index: `{ "location": "2dsphere" }`
- Compound search index: `{ "locationScope": 1, "verificationStatus": 1, "propertyType": 1, "pricePerNight": 1 }`
- Provenance index: `{ "source.file": 1, "source.originalId": 1 }`

---

## 2. Collection: `medicalPoints`

### Purpose
Provides critical healthcare assistance points (hospitals, first-aid posts, medical booths, ambulance hubs) for pilgrims.

| Field Name | Data Type | Optional / Required | Default | Source / Provenance | Description & Normalization Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Required (Auto) | Auto | MongoDB | Primary key. |
| `name` | String | Required | — | Health Directory | Facility name (e.g. `Swaroop Rani Nehru Hospital`). |
| `type` | String | Required | — | Health Directory | Normalized enum: `Hospital`, `Medical Booth`, `First Aid Post`, `Ambulance Point`, `Primary Health Centre`. |
| `address` | String | Optional | `""` | Health Directory | Street/Sector/Ghat address. |
| `location` | GeoJSON Point | Required | — | GPS Coordinates | `{ type: "Point", coordinates: [longitude, latitude] }`. |
| `phone` | String | Optional | `""` | Emergency Line | Verified contact / helpline telephone string. |
| `services` | Array of Strings | Optional | `[]` | Health Directory | Capabilities: `Emergency ICU`, `OPD`, `Trauma Care`, `Ambulance Dispatch`, `First Aid`, `Pharmacy`. |
| `isEmergency` | Boolean | Required | `true` | Health Directory | Indicates 24x7 emergency response capability. |
| `isActive` | Boolean | Required | `true` | Admin / Ops | Operational status during the Mela. |
| `locationScope` | String | Required | — | Geographic Tag | Strict enum: `"prayagraj"`, `"nashik"`, `"generic"`, `"unknown"`. |
| `dataStatus` | String | Required | `"reference"` | Pipeline | Enum: `"verified"`, `"unverified"`, `"reference"`, `"demo"`. |
| `source` | Object | Required | — | Pipeline | Audit object: `{ file: String, originalId: String }`. |
| `createdAt` | Date | Required | Auto | System | Creation timestamp. |
| `updatedAt` | Date | Required | Auto | System | Modification timestamp. |

### Indexes
- 2dsphere index: `{ "location": "2dsphere" }`
- Compound index: `{ "locationScope": 1, "type": 1, "isEmergency": 1 }`

---

## 3. Collection: `landmarks`

### Purpose
Stores important Kumbh locations, snan ghats, temples, and pilgrim assembly areas.

| Field Name | Data Type | Optional / Required | Default | Source / Provenance | Description & Normalization Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Required (Auto) | Auto | MongoDB | Primary key. |
| `name` | String | Required | — | Mela Administration | Landmark title (e.g., `Triveni Sangam`, `Ramkund`). |
| `type` | String | Required | — | Mela Administration | Enum: `ghat`, `temple`, `akhada`, `mela_ground`, `historic_site`. |
| `description` | String | Optional | `""` | Documentation | Historical and pilgrim significance. |
| `address` | String | Optional | `""` | Mela Administration | Sector / Zone address. |
| `location` | GeoJSON Point | Required | — | GPS Survey | `{ type: "Point", coordinates: [longitude, latitude] }`. |
| `importance` | String | Optional | `"high"` | Administration | Significance level: `critical`, `high`, `medium`, `local`. |
| `locationScope` | String | Required | — | Geographic Tag | Strict enum: `"prayagraj"`, `"nashik"`, `"generic"`, `"unknown"`. |
| `dataStatus` | String | Required | `"reference"` | Pipeline | Enum: `"verified"`, `"unverified"`, `"reference"`, `"demo"`. |
| `source` | Object | Required | — | Pipeline | Audit object: `{ file: String, originalId: String }`. |
| `createdAt` | Date | Required | Auto | System | Creation timestamp. |
| `updatedAt` | Date | Required | Auto | System | Modification timestamp. |

### Indexes
- 2dsphere index: `{ "location": "2dsphere" }`
- Search index: `{ "locationScope": 1, "type": 1 }`

---

## 4. Collection: `transportPoints`

### Purpose
Stores transit hubs, railway stations, bus terminuses, shuttle stops, and designated parking areas.

| Field Name | Data Type | Optional / Required | Default | Source / Provenance | Description & Normalization Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Required (Auto) | Auto | MongoDB | Primary key. |
| `name` | String | Required | — | Transport Authority | Transit point name (e.g. `Prayagraj Junction`, `Nashik Road Station`). |
| `type` | String | Required | — | Transport Authority | Enum: `railway_station`, `bus_station`, `parking`, `shuttle_point`, `transport_hub`. |
| `address` | String | Optional | `""` | Transport Authority | Location address / sector. |
| `location` | GeoJSON Point | Required | — | GPS Survey | `{ type: "Point", coordinates: [longitude, latitude] }`. |
| `locationScope` | String | Required | — | Geographic Tag | Strict enum: `"prayagraj"`, `"nashik"`, `"generic"`, `"unknown"`. |
| `dataStatus` | String | Required | `"reference"` | Pipeline | Enum: `"verified"`, `"unverified"`, `"reference"`, `"demo"`. |
| `source` | Object | Required | — | Pipeline | Audit object: `{ file: String, originalId: String }`. |
| `createdAt` | Date | Required | Auto | System | Creation timestamp. |
| `updatedAt` | Date | Required | Auto | System | Modification timestamp. |

### Indexes
- 2dsphere index: `{ "location": "2dsphere" }`
- Scope index: `{ "locationScope": 1, "type": 1 }`
