# 🚀 SAI GOPAL MAYUR — ENTERPRISE DATA ENGINEERING & AI PLATFORM HUB

[![Live Portfolio](https://img.shields.io/badge/🌐_Live_Portfolio-Click_to_View_Online-0078D4?style=for-the-badge&logo=githubpages&logoColor=white)](https://saigopal9666.github.io/portfolio-website/)
[![DP-203 Verified](https://img.shields.io/badge/Microsoft-DP--203_Azure_Data_Engineer-blue?style=for-the-badge&logo=microsoft)](https://saigopal9666.github.io/portfolio-website/)
[![DP-700 Candidate](https://img.shields.io/badge/Microsoft-DP--700_Fabric_Data_Engineer-purple?style=for-the-badge&logo=microsoftfabric)](https://saigopal9666.github.io/portfolio-website/)
[![Medium Articles](https://img.shields.io/badge/Medium-@ramgopal1992.m-black?style=for-the-badge&logo=medium)](https://medium.com/@ramgopal1992.m)

Welcome to the official source code for **Sai Gopal Mayur's Interactive Engineering Portfolio**. This platform showcases production-grade **Azure Data Engineering pipelines, PySpark Medallion Lakehouses, Microsoft Fabric architectures, Cybersecurity command centers, and Generative AI platforms**.

---

## 🌟 PUBLIC LIVE WEBSITE URL
👉 **[https://saigopal9666.github.io/portfolio-website/](https://saigopal9666.github.io/portfolio-website/)**

---

## 🛠️ COMPREHENSIVE TECH STACK & DESIGN SYSTEM
* **Frontend UI/UX:** HTML5, Modern Vanilla CSS3 (Slate & Navy Executive Theme with Glassmorphic Glow), JavaScript ES6+ (Zero heavy framework overhead for sub-second page loads).
* **Architecture:** 3-Tier Medallion Lakehouse Architecture (Bronze ➔ Silver ➔ Gold), REST APIs, JSON-RPC 2.0.
* **Cloud & Big Data Stack:** Azure Data Factory (ADF), Databricks, Apache Spark 3.5, PySpark DataFrames, Delta Lake, Microsoft Fabric, OneLake.
* **AI & Security Engineering:** Vapi Voice AI SDK, OpenAI GPT-4, ElevenLabs TTS, Model Context Protocol (MCP), Anti-Deepfake Cryptography, GDPR Art. 17 Automation.
* **Database & Querying:** ANSI SQL, T-SQL, PostgreSQL, Azure SQL, Parquet, Delta Lake DDL.
* **Global Hosting:** GitHub Pages (24/7 Edge CDN Deployment).

---

## 🚀 FEATURED PRODUCTION ENGINEERING PROJECTS (FULL BREAKDOWN)

### 1. ⚡ Enterprise EV Telemetry Data Engineering Platform
* **Stack:** Azure Data Factory, Databricks, PySpark, Delta Lake, ADLS Gen2
* **Description:** A 3-Tier Medallion Lakehouse architected to process **50 Million synthetic EV telemetry records** per day.
* **Key Architecture:**
  - **Metadata-Driven ADF Control Tables:** Uses Azure SQL Control Tables (`TableName`, `WatermarkColumn`) to dynamically orchestrate 100+ copy activities in a single loop.
  - **Data Quality Quarantine Pattern:** Automatically separates corrupt records (`speed > 250 km/h` or negative battery temps) into a `quarantine_ev_telemetry` Delta table.
  - **Idempotent Delta MERGE INTO (CDC):** Guarantees zero duplicate records across re-runs.
  - **Delta Liquid Clustering (`CLUSTER BY vehicle_id, date`):** Replaces legacy Z-Ordering to deliver **100x query acceleration** for Power BI DirectLake analytics.

### 2. 🛒 Retail Sales Analytics — Medallion Architecture
* **Stack:** PySpark, Apache Spark 3.5, Delta Lake, Microsoft Fabric, Power BI
* **Description:** End-to-end Data Engineering pipeline using **PySpark** with strict `StructType` Schema Enforcement, advanced deduplication via Spark Window Functions (`DENSE_RANK()`, `ROW_NUMBER()`), and custom Data Quality Framework routing corrupted logs into Delta Lake.

### 3. 🐦 Generating Sample Elon Musk Tweet Data for Fabric Medallion Pipeline
* **Stack:** Python Streaming Generator, Microsoft Fabric, Medallion Lakehouse, Delta Lake
* **Description:** Real-time Twitter/X stream ingestion pipeline analyzing public tech trends and Elon Musk tweet engagement. Processes raw tweet streams through Microsoft Fabric Lakehouse using Bronze (Raw), Silver (Cleaned), and Gold (Analytics) Delta tables.

### 4. 💻 Interactive SQL to PySpark & Delta Code Translation Engine
* **Stack:** JavaScript AST Parsing, PySpark DataFrames, Delta Lake DDL
* **Description:** Interactive web application converting complex ANSI SQL queries (`GROUP BY`, `HAVING`, `DENSE_RANK`) into production-ready PySpark DataFrame transformations and Delta Lake optimization code.

### 5. 🛡️ Sentinel-X AI — Military-Grade Personal Cyber Guardian
* **Stack:** HTML5, Canvas Cryptography, Dark Web OSINT API, GDPR Legal Engine
* **Description:** Zero-Trust personal cybersecurity command center featuring a **Dark Web OSINT Leak Scanner** querying 10B+ breach records, **Cryptographic Anti-AI Pixel Watermarking** to break deepfake face-morphing models, and automated **GDPR Article 17 & CCPA 'Right to Be Forgotten'** legal deletion notice generation for 25+ data brokers.

---

## 📰 INTERACTIVE PLATFORM MODULES & FEATURES

### ⚡ 1. Real-Time Tech & AI News Engine
* Integrated dynamic news portal featuring rotating 2026 AI/Data stories, HD Unsplash image matrix, and an interactive **News Reader Modal (`#newsReaderModal`)** for full article reading without page reloads.

### 🎓 2. Interactive SQL Masterclass & Course Hub
* Built-in dedicated interactive SQL learning portal (`sql-course.html`, `course.css`) offering step-by-step query tutorials from basic `SELECT` queries to advanced Window Functions (`ROW_NUMBER()`, `LEAD()`, `LAG()`).

### 🎨 3. Interactive 3D Preview Visualizer
* Custom interactive 3D component preview visualizer (`ultimate_3d_preview.html`) demonstrating modern UI micro-animations and glassmorphism.

### 📊 4. Typical Data Engineering Pipeline Architecture (ETL & ELT Flow)
* Visual architectural representation of enterprise data pipelines:  
  `RAW DATA` ➔ `SPARK PROCESSING` ➔ `DELTA LAKEHOUSE (Bronze / Silver / Gold)` ➔ `POWER BI / SYNAPSE ANALYTICS`

---

## 🏆 INDUSTRY CERTIFIED EXPERTISE

* 🥇 **Microsoft Certified: Azure Data Engineer Associate (DP-203)** — Verified Credential
* 💜 **Microsoft Certified: Fabric Data Engineer (DP-700 Candidate)** — Free Voucher Recipient (Exam Date: Sept 2026)

---

## 👨‍💻 ABOUT THE AUTHOR & CONTACT

**Sai Gopal Mayur, MCA**  
*Azure Data Engineer & GenAI Platform Architect*  
* 🌐 **Live Portfolio:** [saigopal9666.github.io/portfolio-website](https://saigopal9666.github.io/portfolio-website/)  
* 🐙 **GitHub:** [github.com/saigopal9666](https://github.com/saigopal9666)  
* 📰 **Medium Technical Articles:** [medium.com/@ramgopal1992.m](https://medium.com/@ramgopal1992.m)  
* 📧 **Email:** ramgopal1992.m@gmail.com  

---

*Open for Global Remote Contracts ($50–$120/hr), Turing/Braintrust Engagements, and UK/EU Visa Sponsorship Roles.*
