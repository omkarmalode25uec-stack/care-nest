# KumbhStay — Data Cleaning & Quality Audit Report (Part 0)

## 1. Executive Summary

- **Source Evaluated:** Google Drive Folder (`https://drive.google.com/drive/folders/1Ecau9bjEqv3cpJMVTqzei5tb44LGBm0i`)
- **Total Files Inspected:** 11 files (across root and `data/` subfolder)
- **Target Database:** MongoDB (`kumbhstay`)
- **Final Platform Target Location:** **Prayagraj Kumbh, Uttar Pradesh, India**
- **External Dataset Scope:** **Nashik Simhastha (Maharashtra) / Generic Volunteer AI Project (SEVAK AI)**
- **Strict Compliance Policy:** Zero fabrication. No conversion of Nashik data into Prayagraj data.

---

## 2. Complete File Inventory & Evaluation

| # | File Name | File Type | Size | Geographic Scope | Information Contained | Useful for KumbhStay Stays? | Target Collection | Action / Reason |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `01_Project_Brief.md` | Markdown | 218 B | Generic | Brief for "SEVAK AI — Agentic Volunteer Operations" | No | None | **Excluded / Reference Only**: Volunteer workflow notes. |
| 2 | `02_Data_Collection_and_Provenance.md` | Markdown | 397 B | Generic | Volunteer data collection notes | No | None | **Excluded / Reference Only**: Operational notes for volunteer tracking. |
| 3 | `03_Data_Quality_and_Realism.md` | Markdown | 378 B | Generic | Telemetry validation and drift metrics | No | None | **Excluded / Reference Only**: ML telemetry guidance. |
| 4 | `04_Evaluation_Plan.md` | Markdown | 263 B | Generic | Model evaluation plans | No | None | **Excluded / Reference Only**: ML validation plan. |
| 5 | `05_Implementation_Checklist.md` | Markdown | 337 B | Generic | Deployment tracker | No | None | **Excluded / Reference Only**: Project milestone checklist. |
| 6 | `GENERATED_DATA_DICTIONARY.csv` | CSV | 2.09 KB | Generic | Dictionary for `volunteer_id`, `fatigue_check`, `incident_id`, `meal_status` | No | None | **Excluded**: Volunteer parameters, no accommodation/stay fields. |
| 7 | `SEVAK AI Agentic volunteer operations.png` | PNG Image | 427.9 KB | Generic | Visual volunteer coordination diagram | No | None | **Excluded**: System architecture image. |
| 8 | `SEVAK_AI_Agentic_Volunteer_Operations_Blueprint.pdf` | PDF Document | 1.05 MB | Nashik (Reference) | 25-page blueprint for volunteer crowd operations at Simhastha Nashik | No (Stay Data) | Reference Architecture | **Excluded from DB**: Strategic document on volunteer staffing; contains no stay listings. |
| 9 | `SEVAK_AI_One_Pager.pdf` | PDF Document | 395.3 KB | Generic | Executive summary of SEVAK AI | No | None | **Excluded**: Executive deck. |
| 10 | `data/qa_sample_250_records.csv` | CSV | 39.9 KB | Synthetic / Unknown | 250 rows of synthetic sensor telemetry (`measurement_value`, `latency_seconds`, `temperature_c`) | No | None | **Excluded**: 100% duplicate subset of synthetic telemetry dataset. |
| 11 | `data/synthetic_development_10000_records.csv` | CSV | 1.59 MB | Synthetic / Unknown | 10,000 rows of synthetic event sensor records | No | None | **Excluded**: Synthetic crowd telemetry; contains zero accommodation, landmark, or medical records. |

---

## 3. Geographic Data Breakdown

- **Prayagraj-specific files/records:** **0 files / 0 records** (Not present in provided Google Drive source).
- **Nashik-specific files:** 1 file (`SEVAK_AI_Agentic_Volunteer_Operations_Blueprint.pdf` mentions Nashik Simhastha context).
- **Generic/Reference files:** 8 files (Architecture, checklists, data dictionary, PDFs).
- **Unknown/Synthetic records:** 10,250 rows across 2 CSV files.

---

## 4. Data Cleaning & Normalization Pipeline

The cleaning pipeline in `scripts/importData.js` enforces the following rules for all incoming datasets:

### A. Duplicate Removal
- Hash-based deduplication across `(name, address, city)` and `(source.file, source.originalId)`.
- 250 identical rows in `qa_sample_250_records.csv` identified as duplicates of `synthetic_development_10000_records.csv`.

### B. Property Type Normalization
Standardized to:
- `hotel`
- `hostel`
- `pg`
- `homestay`

### C. Amenities Normalization
Normalized to:
- `wifi`
- `ac`
- `water`
- `hotWater24h`
- `parking`
- `attachedBathroom`

### D. Occupant Preferences Normalization
Normalized to:
- `family`
- `female`
- `bachelor`
- `children`
- `seniorCitizen`

### E. Geospatial Validation
- Strict GeoJSON Point format: `location: { type: "Point", coordinates: [longitude, latitude] }`.
- Verified longitude range: $[-180, 180]$ and latitude range: $[-90, 90]$.
- Swapped coordinates $[latitude, longitude]$ are corrected during ingestion.
- Missing or non-numeric coordinates are flagged and stored with `location: null`.

### F. Sensitive Data Protection
- Any Aadhaar numbers, PAN numbers, bank accounts, or unhashed passwords detected in source files are **strictly excluded**.
- Redaction marker: `"SENSITIVE FIELD EXCLUDED"`.

---

## 5. MongoDB BSON Dump & Provisioning

Target database: `kumbhstay` (located at `data/kumbhstay/`)

| Collection Name | Record Count | Geographic Scope | BSON Dump File |
| :--- | :--- | :--- | :--- |
| `properties` | 0 | `prayagraj` / `nashik` | `data/kumbhstay/properties.bson` |
| `medicalPoints` | 0 | `prayagraj` / `nashik` | `data/kumbhstay/medicalPoints.bson` |
| `landmarks` | 0 | `prayagraj` / `nashik` | `data/kumbhstay/landmarks.bson` |
| `transportPoints` | 0 | `prayagraj` / `nashik` | `data/kumbhstay/transportPoints.bson` |
| `reviews` | 0 | `prayagraj` / `nashik` | `data/kumbhstay/reviews.bson` |
| `kumbhLocations` | 0 | `prayagraj` / `nashik` | `data/kumbhstay/kumbhLocations.bson` |
| `emergencyPoints` | 0 | `prayagraj` / `nashik` | `data/kumbhstay/emergencyPoints.bson` |

*Note: All collections are initialized with strict geospatial 2dsphere indexes and validation rules with 0 fabricated records.*
