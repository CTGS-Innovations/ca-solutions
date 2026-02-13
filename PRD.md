## PRD: Computer Ally, QR-Based Repair Intake + Transparent Process Value Site

### 1) Overview

**Product name:** Computer Ally
**Problem:** Repairs feel like a commodity because the work is largely invisible, customers don’t understand the process, risk reduction, or added value.
**Solution:** A modern website + intake and status portal that generates a **QR-coded job tracker** per device, showing a **clear process flow**, status updates, and optional safeguards, without requiring the tech to “sell.”

---

## 2) Goals and Non-Goals

### Goals

* Increase perceived value by making the repair process visible and structured.
* Reduce dependence on in-person explanation (especially helpful for ADHD operator).
* Improve customer trust with transparent status updates and clear expectations.
* Increase average ticket via **non-salesy “Safeguards / Enhancements”** presented as optional, educational items.
* Improve operational consistency (checklists, timestamps, status states).

### Non-Goals (for MVP)

* Full e-commerce store for parts.
* Complex CRM replacement.
* Deep remote management tooling.
* AI chat concierge (optional later).

---

## 3) Target Users and Personas

### Customer Personas

1. **Stressed Professional**

* Needs laptop back quickly, afraid of data loss.
* Values clarity and timelines, will pay for reliability.

2. **Parent / Home User**

* Confused by tech jargon, wants “safe and working.”
* Responds well to simple, reassuring process and prevention.

3. **Small Business Owner**

* High value of uptime, wants documentation and repeatable service.
* Wants invoices, status visibility, and continuity options.

### Internal Persona

4. **Technician / Owner (ADHD-friendly flow)**

* Wants minimal talking/selling.
* Wants a simple intake + repeatable checklist.
* Wants to avoid “tier pitching,” prefers transparent options.

---

## 4) Key User Journeys

### Journey A: Walk-in Drop-Off (Primary)

1. Staff creates a job ticket in Admin.
2. System generates **Job ID + QR code** printed or shown on screen.
3. Customer scans QR -> **Job Status Page**.
4. Customer sees:

   * “What happens next” process flow
   * Current stage and timestamps
   * What was found (optional, later)
   * Optional safeguards (non-pushy)
5. Notifications: “Checked in,” “Diagnosis complete,” “Ready for pickup.”

### Journey B: Customer Checks Status (Self-serve)

1. Customer returns to status page via QR / link.
2. Sees current step, expected next step, and notes.
3. If needed, requests add-ons (backup, optimization) without calling.

### Journey C: Admin Intake + Work Completion

1. Admin logs device details and symptoms.
2. Technician uses checklist to mark tasks completed.
3. System compiles customer-facing summary (“what we did”).
4. Mark ready, send pickup message.

---

## 5) Product Requirements (MVP Scope)

### 5.1 Marketing Site (Public)

**Pages**

* Home
* Services
* “Our Process” (core perceived value page)
* Business Services (optional)
* FAQs
* Contact / Hours / Location
* Privacy / Terms

**Requirements**

* Fully responsive, fast, accessible (WCAG basics).
* Style guide integration (colors/typography/components).
* Clear CTA: “Start a Repair,” “Check Repair Status.”

---

### 5.2 Repair Status Portal (Customer-facing, No Login)

**Access**

* Unique, hard-to-guess tokenized URL (e.g., `/repair/<publicToken>`).
* QR code encodes that URL.

**Status Page Modules**

1. **Job Header**

* Device type, brand/model (optional), job number, check-in date.
* Current status and next step.

2. **Process Flow Visualization**

* A stepper/timeline showing typical flow:

  * Checked In
  * Diagnostics
  * Repair In Progress
  * Stability & Validation
  * Ready for Pickup
* Each step has: short “what this means” tooltip text.

3. **What We Do Every Time (Visible Checklist)**

* 10–15 baseline items (non-technical plain English).

4. **Risk Reduction Section**

* “What this prevents” with icons and short bullets:

  * Data loss, drive failure, malware persistence, recurring crashes.

5. **Optional Safeguards (Non-salesy Add-ons)**

* Presented as “Recommended Enhancements” with transparent pricing and why it matters.
* Customer can request an add-on with one click (creates admin task).
* Example add-ons:

  * Data Backup Setup
  * Performance Tune-Up
  * Security Hardening
  * Long-Term Monitoring
  * Upgrade Evaluation

6. **Updates / Notes**

* Short update log entries (controlled by admin, templated).

7. **Pickup Instructions**

* Hours, what to bring, payment methods.

**No-login security note**

* Display minimal PII. No full name required on page.
* Use an optional “last 4 digits of phone” challenge if you want an extra layer later (not required for MVP).

---

### 5.3 Admin Console (Internal)

**Authentication**

* Staff login (email + password), MFA optional (recommended).
* Role-based access: Owner/Admin, Tech, Front Desk (limited).

**Core Admin Features**

1. Create repair ticket

* Customer contact (name, phone, email)
* Device details
* Problem description
* Intake condition checklist (optional)
* Estimate range (optional)
* Status set to “Checked In”
* Generate QR + print view

2. Ticket list + search

* Filter by status, date, tech, customer
* “Overdue” indicator based on SLA targets

3. Ticket detail

* Status updates
* Internal notes vs customer-facing notes
* Checklist tasks (baseline + add-ons)
* Add-on requests (customer triggered)
* Time stamps for each stage
* Close ticket + completion summary

4. Templates / Content

* Edit baseline checklist items
* Edit process steps wording
* Edit add-on catalog (name, description, price)

---

## 6) UX / UI Requirements (Structure, Not the Style Guide)

* Modern, calm, “trusted IT partner” feel.
* Strong hierarchy, minimal cognitive load.
* Mobile-first for customer portal (QR users are typically on phones).
* Components:

  * Stepper/timeline
  * Cards for modules
  * “What we did” checklist with checkmarks
  * Add-on cards with “Request” action
  * Status badges (Checked In, In Progress, Waiting Approval, Ready)

**Print view**

* A printable QR receipt:

  * QR code, job ID, URL short link
  * Hours, basic terms
  * “Check status anytime” message

---

## 7) Data Model (MVP)

### Entities

**Customer**

* id, name (optional), phone, email, createdAt

**Device**

* id, type (laptop/desktop/other), make, model, serial (optional), conditionNotes

**RepairTicket**

* id (internal), publicToken (for URL), jobNumber (human friendly)
* customerId, deviceId
* status (enum)
* intakeNotes
* internalNotes
* customerNotesLog[] (entries)
* checklistItems[] (baseline tasks with state)
* addOnRequests[] (requested, approved, declined)
* timestamps: checkedInAt, diagnosticsAt, repairAt, validationAt, readyAt, closedAt

**AddOnCatalogItem**

* id, name, description, price, active, sortOrder

---

## 8) Status Enum (Suggested)

* CHECKED_IN
* DIAGNOSING
* AWAITING_APPROVAL (optional)
* REPAIR_IN_PROGRESS
* VALIDATION
* READY_FOR_PICKUP
* CLOSED

---

## 9) Notifications (MVP)

* Email and/or SMS triggered on status changes:

  * Checked in
  * Diagnostics complete
  * Approval requested (if used)
  * Ready for pickup
* Keep content templated and short.

(You can do email-only MVP, SMS as Phase 1.1.)

---

## 10) Tech Requirements

### Frontend

* **React** (Next.js recommended for SEO + routing + SSR)
* Component library approach (Shadcn/UI or similar), your style guide applied on top
* State: React Query / TanStack Query for data fetching
* Form handling: React Hook Form + Zod validation

### Backend

* **Node.js** (NestJS or Express/Fastify)
* REST API for simplicity (GraphQL optional later)
* Auth: JWT + refresh tokens, HttpOnly cookies for admin
* Rate limiting, request validation, audit logs (basic)

### Database

* Postgres (recommended)
* ORM: Prisma

### Hosting / Infra

* Vercel (frontend) + Render/Fly.io/AWS (backend)
* Or all-in-one on a single platform if you prefer
* Object storage not needed MVP

### Security

* Tokenized public repair URLs (unguessable)
* Limit PII exposure on public page
* Admin MFA recommended
* Basic logging and alerting

### Analytics

* Track:

  * QR scans
  * Status page views
  * Add-on requests conversion rate
  * Average ticket value (manual input later)

---

## 11) MVP Acceptance Criteria

* Admin can create a ticket in < 60 seconds.
* Ticket creation produces a QR receipt with working public status URL.
* Customer status page loads in < 2 seconds on mobile.
* Customer can clearly see:

  * current stage,
  * next stage,
  * “what we do every time,”
  * optional safeguards.
* Admin can update status + add a customer-facing update.
* Customer receives notification when status changes (at least email).

---

## 12) Mockups You Should Build (for the friend demo)

1. **Home page hero**

* “Drop off, scan, track, pick up.”
* CTA: “Check Repair Status” + “Start a Repair”

2. **Public Status Page**

* Top: status badge + stepper timeline
* Middle: baseline checklist module
* Middle: “What this prevents” module
* Bottom: “Recommended Enhancements” add-on cards
* Footer: pickup instructions

3. **Admin Ticket Create**

* Minimal form, QR output modal, print receipt button

4. **Admin Ticket Detail**

* Status dropdown, checklist, notes, add-on requests

---

## 13) Rollout Plan

### Phase 0 (Demo)

* Hard-coded mock data
* Polished UI
* No backend needed, use JSON fixtures to present the concept

### Phase 1 (MVP)

* Real ticket creation + QR + public status page
* Basic admin auth + Postgres
* Email notifications

### Phase 1.1

* SMS notifications
* Approval workflow for add-ons
* Digital signature / terms acknowledgement (optional)

### Phase 2

* Payments, invoices, service history
* Business accounts
* Automated “completion summary” PDFs

---

## 14) What Makes This “Not Salesy”

Key language rules for the UI copy:

* Avoid “packages,” “tiers,” “upgrade now”
* Use:

  * “Every repair includes…”
  * “Recommended safeguards”
  * “Common risks prevented”
  * “Optional enhancements if you want extra protection”
* Keep it educational, transparent, and calm.

---

If you want, I can also write:

* the exact copy for the baseline checklist and the process-step descriptions, and
* a clickable “demo script” flow for how you present it to him in 3 minutes.
