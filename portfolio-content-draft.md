# Portfolio content draft

Editorial draft for Sanha Tahir's Data Engineer portfolio. This file is the editorial reference for the redesigned HTML website. Publication questions and evidence notes are in `portfolio-content-review.md`.

## Homepage

### Opening

**Sanha Tahir · Data Engineer**

Better decisions start with data you can trust.

Behind every confident decision is data that has earned that confidence. That’s where I come in. I take messy, fragmented source data through carefully designed pipelines and turn it into polished, gold-layer data marts—ready for people to explore, understand, and act on.

**Links:** Explore my work · [View résumé](https://docs.google.com/document/d/1F3UQLdfPPztZ3xPrAO6PLZ96uwMsPsc4Q-I4y_uJeEQ/edit?usp=sharing) · Get in touch

### When to call me

**Drowning in data, searching for meaning?** If your company has mountains of data and no clear way to make sense of it, I can help turn the mess into models, metrics, and marts that answer real questions.

**Pipelines running late—or losing your trust?** Consider me your pipeline doctor. I trace the symptoms, diagnose the root cause, and help get your data flowing reliably again.

**Inmon or Kimball? Let's get philosophical.** If you want to debate modeling techniques, question a grain, or weigh the trade-offs of a warehouse design, I'm your philosophizing partner. Bring your strongest opinions—and your use case.

### Selected work

#### Customer usage reporting that reflects how customers actually operate

A request to put product usage into a customer-success tool became an end-to-end data product. I clarified metric definitions, modeled account hierarchies, built an automated daily export, and resolved identity and aggregation issues that could have left customers missing or their activity overstated.

**Focus:** Dimensional modeling · Data quality · Reverse ETL

**Tools:** BigQuery, dbt, Python, Airflow, Cloud Composer, Terraform

**Link:** Read the case study

#### A complete test environment for the data platform

I brought a new GCP test environment online, from Terraform-managed infrastructure and database CDC to warehouse builds, CI/CD, and failure alerts. The work gave the team a place to validate pipelines against QA data before production changes.

**Focus:** Infrastructure as code · CDC · Deployment · Observability

**Tools:** Terraform, GCP, BigQuery, Cloud Composer, Cloud Build, Estuary

**Link:** Read the case study

#### Efficient, correct event processing on a five-minute cadence

I investigated how incremental event models behaved under frequent execution, traced expensive scans to MERGE behavior, and used measured arrival latency to inform processing windows. The work connected cost optimization with a critical correctness constraint: an incremental model must still recognize records it has already processed.

**Focus:** Incremental modeling · Query performance · Cost analysis

**Tools:** BigQuery, dbt, Snowplow, Airflow

**Link:** Read the case study

### Experience

#### Data Engineer · Transfr

September 2025–Present

Transfr builds VR career-training products for schools and workforce organizations. I develop the data systems supporting internal analytics, customer-facing reporting, and operational feeds to business tools.

- Build and maintain ingestion, dbt transformations, and Airflow workflows on BigQuery and Cloud Composer, including daily and five-minute processing paths.
- Model customer, product, and revenue data using explicit grains, hierarchy bridges, versioned models, contracts, and tests.
- Deliver customer-usage data to Salesforce and ClientSuccess, working with business teams to define metrics and validate their interpretation.
- Provision infrastructure and monitoring with Terraform, including a new test environment, CI/CD, access controls, and pipeline-failure alerts.
- Investigate silent data failures, reconcile missing records, and harden ingestion with retries, batching, validation, and backfills.
- Contribute to the FastAPI reporting service, code reviews, documentation, and engineer onboarding.

#### Data Engineer · World Bank Group, Data360

May 2024–September 2025

Built more than 15 Python and Kedro ETL pipelines for Data360, integrating diverse source datasets into standardized, reusable outputs.

- Transformed source data into SDMX-compliant formats to support consistent integration and downstream use.
- Worked with source creators to curate metadata and document pipelines, improving discoverability and interpretation.
- Implemented validation and anomaly checks that reduced data inconsistencies by 15%.
- Designed and iteratively tested five stakeholder-facing visualizations, increasing engagement by 16%.
- Contributed to Git-based review and reproducible development workflows.

#### Research Assistant · Georgetown University

January 2023–August 2024

Developed a GCP document-processing pipeline for more than 140,000 PDFs, converting documents into images for digitization and extraction.

- Combined image processing, a custom CNN, and Google Cloud Vision to extract information from handwritten forms.
- Used fuzzy matching and tiered joins in pandas to connect extracted names and identifiers with external datasets.

#### Data Scientist · Afiniti

August 2020–January 2022

Developed SQL and Python data workflows supporting machine learning and customer analytics.

- Automated ETL processes with Talend and Python, reducing pipeline completion time by 30%.
- Integrated records from multiple sources using tiered matching strategies, achieving an 80%+ matching success rate.
- Maintained historical CRM data with MySQL and SCD Type II tracking.
- Investigated data and model issues, and communicated findings through dashboards and analyses for internal teams and clients.

### Technical toolkit

**Ingestion and integration:** Python, REST APIs, PostgreSQL CDC, Estuary, Kedro, Talend

**Warehousing and modeling:** SQL, BigQuery, dbt, dimensional modeling, incremental models, snapshots, SCD Type II

**Orchestration and infrastructure:** Airflow, Cloud Composer, Terraform, Cloud Build, Cloud Storage, IAM, Secret Manager

**Quality and delivery:** Data contracts, freshness checks, reconciliation, SQLFluff, pytest, Git, FastAPI, reverse ETL

**Additional experience:** AWS, PySpark, machine learning workflows, R, Shiny, data visualization

### About

My background spans customer analytics, public policy, and production data platforms. Across those settings, I enjoy the same challenge: understanding what people need from their data and building the systems that make it dependable.

I ask questions early—about definitions, ownership, edge cases, and the decisions a dataset should support. I like delivering something useful, learning from feedback, and improving it as the requirements become clearer.

I hold a master's in Data Science for Public Policy from the McCourt School of Public Policy at Georgetown University and a bachelor's in Economics and Mathematics from Lahore University of Management Sciences.

Away from the keyboard, music and dance are part of my routine. Zumba gets my day moving, and a burst of cardio helps me reset after a challenging one.

### Contact

Interested in working together? Let's talk.

**Links:** [Email](mailto:sanha.tahir@gmail.com) · [LinkedIn](https://www.linkedin.com/in/sanha-tahir/) · [GitHub](https://github.com/sanhatahir) · [Résumé](https://docs.google.com/document/d/1F3UQLdfPPztZ3xPrAO6PLZ96uwMsPsc4Q-I4y_uJeEQ/edit?usp=sharing)

## Case study 1: Customer usage reporting that reflects how customers actually operate

### Overview

**Company:** Transfr

**My role:** Requirements discovery, warehouse modeling, export development, validation, and iterative delivery

**Stack:** BigQuery, dbt, Python, Airflow on Cloud Composer, Cloud Storage, Terraform

### The problem

The initial request was straightforward: make product usage available in a customer-success tool. Defining useful usage data took more discussion.

Which activities counted? Did the team need an individual organization's activity or a parent account's combined usage? How should we count people active across multiple organizations? How often should the data refresh, and what decisions would it support?

Those answers shaped both the metrics and the pipeline.

### My approach

I mapped the requirements against the warehouse and separated the work into stages. I started with an existing metric and its daily export, then developed new calculations using available data, and finally integrated additional sources where the requirements demanded them.

I used dbt to build the daily usage model, with contracts and grain tests to validate its structure. Python and Airflow handled the daily export, while Terraform managed the destination bucket and third-party access. Documentation made the metric definitions available alongside the data.

### The engineering decisions

**Model at the account grain.** A customer's Salesforce account could represent several organizations. I rolled usage up through an account-hierarchy bridge so parent accounts reflected their descendants.

**Resolve identities across sources.** A single Salesforce field was insufficient to map all active organizations. Using an organization-to-account bridge spanning multiple sources prevented roughly 100 active customer organizations from being dropped from reporting.

**Recalculate distinct metrics after rollup.** Adding organization-level distinct counts could count the same activity more than once across an account's organizations. I rebuilt event-based measures as distinct event counts at the account grain.

**Constrain the date spine.** Expanding the hierarchy across every reporting day produced an oversized intermediate design. Restricting the ancestor side to reportable accounts brought the resulting table from roughly 200 million rows in the draft design to a few million rows.

### Results

The team received an automated daily feed backed by documented warehouse metrics, supporting reporting across approximately 2,000 organizations. The account-level implementation corrected identity and aggregation problems, and resolved blank names for roughly 300 accounts.

### What this project shows

A reliable data product depends on agreeing what the data means, choosing the right grain, and validating how records move between systems. I stayed involved through those decisions and continued investigating gaps after the initial delivery.

## Case study 2: Bringing a GCP test environment online

### Overview

**Company:** Transfr

**My role:** Infrastructure provisioning, CDC configuration, orchestration integration, and pipeline validation

**Stack:** Terraform, BigQuery, Cloud Composer 3, Cloud Build, Secret Manager, IAM, Estuary, Aurora PostgreSQL

### The problem

The team needed a third environment where dbt, Airflow, and the reporting API could be validated against QA data. The GCP project was nearly empty, so making it usable required work across infrastructure, permissions, ingestion, and deployment.

### What I built

I provisioned landing datasets, a staging bucket, service accounts, Composer on a Shared VPC, and Cloud Build integration. I brought API enablement under Terraform and configured access through IAM and Secret Manager. Failure alerts covered DAGs and builds.

I connected multiple QA databases through Estuary CDC and integrated the new environment into the dbt targets, Airflow environment detection, and CI configuration.

### The engineering decisions

**Make access explicit.** I diagnosed permissions independently across cloud IAM, database SELECT grants, logical-replication publications, and source rediscovery. A working connection alone did not establish that every intended table would replicate.

**Review infrastructure changes before applying.** I used Terraform moved blocks for state renames and reviewed saved plans for unintended destroys. The environment was delivered through applies with zero destroys, with no drift across development, production, and test at final verification.

**Validate the complete build.** Once infrastructure and ingestion were available, I checked model selection parity, investigated build failures, created missing views, and full-refreshed incremental facts where needed. I also identified a test snapshot configured to write to production and excluded it.

### Results

The test environment came online with CDC from multiple databases and an initial load of roughly 8 million rows. Infrastructure, deployment configuration, and monitoring were managed as code, and pipeline validation extended beyond provisioning to actual warehouse dependencies and builds.

### What this project shows

I can carry platform work across service boundaries and troubleshoot the gaps between an infrastructure plan, a successful deployment, and a functioning data pipeline.

## Case study 3: Understanding the cost and correctness of frequent event processing

### Overview

**Company:** Transfr

**My role:** Event-model development, cost investigation, incremental design, and deployment planning

**Stack:** BigQuery, dbt, Snowplow, Airflow

### The problem

On a five-minute schedule, small inefficiencies repeat hundreds of times a day. I investigated the Snowplow processing path to understand which data each run scanned and how incremental windows affected both cost and deduplication.

### Investigation and design

I replaced vendor normalization packages with a custom incremental, partitioned base event model and repointed the downstream staging models to it. I moved deduplication before context unnesting to make event selection deterministic.

I compared MERGE behavior with and without a target predicate, then added explicit target-window filtering to the incremental design.

I measured arrival latency across tens of millions of events and used the observed lag to configure a source lookback and a wider target window.

### The correctness constraint

Source and target windows must be designed together. If the source includes a previously processed event but the target predicate excludes its existing row, a MERGE can insert a duplicate. The wider target window was therefore part of the correctness design as well as the performance strategy.

### Delivery

I shipped the event-model remodel and incremental tuning, including partitioning, target predicates, and latency-informed processing windows.

I also documented deployment sequencing, including pausing the near-real-time DAG for a full refresh, and a breaking column rename for downstream consumers.

### What this project shows

I use measurements to investigate performance, account for the correctness implications of optimizations, and plan how changes reach production safely.
