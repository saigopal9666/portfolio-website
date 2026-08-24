# 🚀 MSG SOFT@SONIC — ENTERPRISE DATA ENGINEERING & AI PLATFORM

[![Live Website](https://img.shields.io/badge/🌐_MSG_Soft%40sonic_Platform-Click_to_Launch-0078D4?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio-website-softsonic1.vercel.app)
[![DP-203 Verified](https://img.shields.io/badge/Microsoft-DP--203_Azure_Data_Engineer-blue?style=for-the-badge&logo=microsoft)](https://portfolio-website-softsonic1.vercel.app)
[![DP-700 Candidate](https://img.shields.io/badge/Microsoft-DP--700_Fabric_Data_Engineer-purple?style=for-the-badge&logo=microsoftfabric)](https://portfolio-website-softsonic1.vercel.app)
[![Medium Masterclasses](https://img.shields.io/badge/Medium-@saigopal_M-black?style=for-the-badge&logo=medium)](https://medium.com/@saigopal_M)

Welcome to **MSG Soft@sonic**, the official engineering portfolio and data platform founded by **Sai Gopal M, MCA**. MSG Soft@sonic is an enterprise-grade **Data Engineering & AI Lakehouse Ecosystem** showcasing production-grade Medallion Lakehouses, real-time IoT Telemetry pipelines, PySpark data quality frameworks, and Power BI Direct Lake analytics.

---

## 🌟 PUBLIC LIVE PLATFORM URL
👉 **[https://portfolio-website-softsonic1.vercel.app](https://portfolio-website-softsonic1.vercel.app)**

---

## 🛠️ COMPREHENSIVE TECH STACK & ARCHITECTURE
* **Platform & Brand:** MSG Soft@sonic (Founded by Sai Gopal M, MCA).
* **Architecture:** 3-Tier Medallion Lakehouse (Bronze ➔ Silver ➔ Gold), REST APIs, JSON-RPC.
* **Cloud & Big Data:** Microsoft Fabric, Azure Data Factory (ADF), Azure Databricks, Apache Spark 3.5, PySpark DataFrames, Delta Lake 3.0, OneLake, Azure Data Lake Gen2.
* **Data Quality & Governance:** Zero-downtime Anomaly Quarantine Frameworks, Deterministic Window Deduplication (ROW_NUMBER), Strict StructType Schema Enforcement.
* **Global Hosting:** Vercel Global Edge Network & GitHub CI/CD.

---

## 🚀 FEATURED PRODUCTION DATA ENGINEERING PROJECTS

### 1. ⚡ 50M Enterprise EV IoT Telemetry Lakehouse Platform
* **Stack:** Microsoft Fabric, PySpark, Delta Lake, OneLake, Azure Data Factory
* **Description:** A 3-Tier Medallion Lakehouse architected to process **50 Million streaming EV telemetry packets** per day from 10,000 electric vehicles.
* **Key Deliverables:**
  - **Strict Schema Enforcement:** Implemented programmatic StructType schema binding under PERMISSIVE mode, achieving 10x faster ingestion over inferSchema.
  - **Data Quality Quarantine Framework:** Automated physical boundary routing isolating sensor hardware glitches (SoC < 0%, Speed > 250 km/h) into quarantine_ev_telemetry Delta tables.
  - **Distributed Window Deduplication:** Eliminated network retry collisions via ROW_NUMBER() OVER (PARTITION BY vehicle_id, reading_timestamp ORDER BY _ingestion_timestamp DESC).
  - **Rolling Battery SoH Moving Average:** Applied sliding time-series window operations (
owsBetween(-9, 0)) to compute real-time battery degradation.
  - **Delta Lake 3.0 Compaction:** Executed OPTIMIZE and Z-ORDER BY (vehicle_id) for sub-second Direct Lake query response.

### 2. 🛒 Retail Sales Analytics — Medallion Architecture
* **Stack:** PySpark, Delta Lake, Microsoft Fabric Data Factory, Power BI Direct Lake
* **Description:** Multi-tier batch ingestion and transformation pipeline orchestrating multi-region sales transactions from ADLS Gen2 into conformed Star Schema dimensional models (Fact Sales, Dim Products, Dim Customers).

### 3. 🐦 Generating Sample Elon Musk Tweet Data for Fabric Medallion Pipeline
* **Stack:** Python Streaming Generator, Microsoft Fabric Lakehouse, Delta Lake
* **Description:** Real-time stream ingestion pipeline analyzing public tech trends and engagement through Bronze (Raw), Silver (Cleaned), and Gold (Analytics) Delta tables.

### 4. 💻 Interactive SQL to PySpark & Delta Code Translation Engine
* **Stack:** JavaScript AST Parsing, PySpark DataFrames, Delta Lake DDL
* **Description:** Interactive web application converting complex ANSI SQL queries (GROUP BY, HAVING, DENSE_RANK) into production-ready PySpark DataFrame transformations.

---

## 🏆 INDUSTRY CREDENTIALS & CERTIFICATIONS

* 🥇 **Microsoft Certified: Azure Data Engineer Associate (DP-203)** — Verified Credential
* 💜 **Microsoft Certified: Fabric Data Engineer (DP-700 Candidate)** — Active Preparation

---

## 👨‍💻 ABOUT THE FOUNDER & CONTACT

**Sai Gopal M, MCA**  
*Azure & Microsoft Fabric Data Engineer | PySpark & Medallion Lakehouse Specialist*  
* 🌐 **Live Portfolio:** [portfolio-website-softsonic1.vercel.app](https://portfolio-website-softsonic1.vercel.app)  
* 🐙 **GitHub:** [github.com/saigopal9666](https://github.com/saigopal9666)  
* 📰 **Medium Articles:** [medium.com/@saigopal_M](https://medium.com/@saigopal_M)  
* 📧 **Email:** saigopalmayur@gmail.com  

---

*Open for Global Remote Contracts (–/hr), US/EU Engagements, and Full-time Data Engineering Roles.*
