# Care Nest — Geographic Data & Scope Report (Part 0)

## 1. Executive Geographic Scope Summary

- **Target Deployment Location:** Prayagraj Kumbh, Uttar Pradesh, India
- **External Google Drive Evaluated:** `https://drive.google.com/drive/folders/1Ecau9bjEqv3cpJMVTqzei5tb44LGBm0i`
- **Drive Data Geographic Jurisdiction:** Nashik Simhastha (Maharashtra, India) / Generic Volunteer Operations (SEVAK AI)
- **Prayagraj Data in Provided Source:** **Not Present (0 records)**

---

## 2. Geographic Data Classification Matrix

| Category | Definition | Source Files Identified in Drive | Total Records | Policy / Handling Action |
| :--- | :--- | :--- | :--- | :--- |
| **Nashik-Specific Data** | Files referencing Nashik Simhastha Kumbh, Godavari River, or Nashik administrative zones. | `SEVAK_AI_Agentic_Volunteer_Operations_Blueprint.pdf` (Mentions Nashik Simhastha context) | 0 structured stay records | **Retained as background reference only.** Never converted, renamed, or assigned to Prayagraj. |
| **Prayagraj-Specific Data** | Structured records situated in Prayagraj, Uttar Pradesh (Sangam, Daraganj, Civil Lines, etc.). | **None in external Drive folder** | **0 records** | **Zero-Fabrication Applied.** Prayagraj data is explicitly reported as absent from the source. |
| **Generic / Reference Data** | Architecture blueprints, volunteer data dictionaries, evaluation templates. | `01_Project_Brief.md`, `02_Data_Collection_and_Provenance.md`, `03_Data_Quality_and_Realism.md`, `04_Evaluation_Plan.md`, `05_Implementation_Checklist.md`, `GENERATED_DATA_DICTIONARY.csv`, `SEVAK AI Agentic volunteer operations.png`, `SEVAK_AI_One_Pager.pdf` | 8 files | **Excluded from stay database.** Used solely as reference for system design. |
| **Unknown / Synthetic Telemetry** | Synthetic sensor records with generic zone IDs and telemetry metrics. | `qa_sample_250_records.csv`, `synthetic_development_10000_records.csv` | 10,250 records | **Excluded.** Quarantined from MongoDB accommodation collections. |

---

## 3. Strict Non-Substitution Policy

To ensure absolute integrity and safety for pilgrims:

1. **No Location Substitution:**
   - **Nashik is NOT converted to Prayagraj.**
   - **Maharashtra is NOT converted to Uttar Pradesh.**
   - **Nashik coordinates are NOT converted to Prayagraj coordinates.**
   - **Nashik hotels/stays are NOT mapped to Prayagraj hotels.**
   - **Nashik medical camps are NOT mapped to Prayagraj medical camps.**
2. **Provenance & Tagging:**
   - Any reference records imported from Nashik datasets are strictly tagged with:
     ```json
     {
       "locationScope": "nashik",
       "dataStatus": "reference"
     }
     ```
   - Prayagraj records must strictly carry:
     ```json
     {
       "locationScope": "prayagraj",
       "dataStatus": "verified"
     }
     ```
3. **Pilgrim Search Isolation:**
   - The production Pilgrim Stay discovery queries are hard-coded to filter `{ "locationScope": "prayagraj" }`.
   - Nashik reference records are completely isolated and will never appear in pilgrim search results.

---

## 4. Prayagraj Data Ingestion Readiness

Because Prayagraj-specific accommodation and medical records were not provided in the Google Drive source, the MongoDB schemas and indexes have been initialized with empty collections (`properties`, `medicalPoints`, `landmarks`, `transportPoints`, `reviews`). 

When an official Prayagraj dataset is provided, it can be seamlessly ingested using the pre-configured data pipeline in `scripts/importData.js`.
