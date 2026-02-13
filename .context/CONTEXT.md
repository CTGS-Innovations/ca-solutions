# Computer Ally Solutions — Project Context

> Last updated: 2025-02-13
> Phase: **Phase 0 (MVP Demo)** — fully built, running as a systemd service

---

## What This Is

Computer Ally is a computer repair business portal that makes the repair process visible to customers. The core value loop:

1. **Admin creates ticket** at intake → system generates QR code
2. **Customer scans QR** → sees real-time status page (no login required)
3. **Customer sees**: process steps, baseline checklist, risk reduction info, optional safeguards
4. **Customer can request add-ons** → admin sees request and can approve/decline
5. **Admin updates status/checklist** → customer page reflects changes instantly

This is a **Phase 0 demo** — no backend, no database. All state lives in React Context with mock data. State resets on page refresh (intentional for clean demos).

---

## Current Status

- **Build**: Clean (`npm run build` passes, 0 errors)
- **All 16 routes**: Verified returning HTTP 200
- **Systemd service**: Installed and active on **port 20100**
- **Cloudflare Tunnel**: Running (tunnel ID `69d5de07-148e-4237-8e28-14a470e6dea6`, account `5630a8bcbd5088268e214e2f72627395`). Needs public hostname pointed at `http://localhost:20100`
- **Hydration fix applied**: `formatDate` uses deterministic formatting (not `toLocaleDateString`), `isOverdue` is client-only

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14.2.35 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS + CSS custom properties | ^3.4.1 |
| Font | Inter (via `next/font/google`) | — |
| State | React Context + useReducer | — |
| QR Generation | qrcode.react | ^4.2.0 |
| Icons | lucide-react | ^0.563.0 |
| Token Generation | nanoid | ^5.1.6 |
| Class Utils | clsx + tailwind-merge | ^2.1.1 / ^3.4.0 |
| Runtime | Node.js | System |
| Process Manager | systemd | — |
| Tunnel | Cloudflare Tunnel (cloudflared) | — |

**No backend, no database, no component library (no shadcn/ui)** — custom components built to the style guide.

---

## Deployment

### Systemd Service

- **Service file**: `service/ca-solutions.service`
- **Management script**: `service/ca-manage.sh`
- **Port**: 20100
- **Binds to**: 0.0.0.0 (all interfaces, required for Cloudflare Tunnel)
- **Runs as**: user `corey`
- **Auto-restarts**: on failure, 5s delay
- **Starts on boot**: yes (`WantedBy=multi-user.target`)

#### Management Commands

```bash
cd /home/corey/projects/ca-solutions/service

sudo ./ca-manage.sh install     # First-time: build + install + enable + start
sudo ./ca-manage.sh start       # Start service
sudo ./ca-manage.sh stop        # Stop service
sudo ./ca-manage.sh restart     # Restart (after code changes + build)
./ca-manage.sh status           # Status + health check
./ca-manage.sh logs 100         # Last 100 log lines
./ca-manage.sh logs 100 -f      # Follow logs
./ca-manage.sh build            # Rebuild (then restart to deploy)
./ca-manage.sh port             # Check port 20100
sudo ./ca-manage.sh uninstall   # Remove service entirely
```

### Cloudflare Tunnel

- Tunnel runs as root process (PID from system boot)
- Token-based auth (remotely managed via Cloudflare Zero Trust dashboard)
- **Action needed**: In Zero Trust dashboard → Networks → Tunnels → configure public hostname to route to `http://localhost:20100`

---

## Routes

### Marketing Site — `(marketing)/` route group

| Route | File | Description |
|-------|------|-------------|
| `/` | `(marketing)/page.tsx` | Home — hero, trust indicators, process timeline, services grid, CTA |
| `/services` | `(marketing)/services/page.tsx` | Full service offerings grid |
| `/process` | `(marketing)/process/page.tsx` | "Our Process" — timeline + baseline checklist |
| `/business` | `(marketing)/business/page.tsx` | Business/enterprise services |
| `/faq` | `(marketing)/faq/page.tsx` | FAQ with accordion |
| `/contact` | `(marketing)/contact/page.tsx` | Hours, location, payment methods |
| `/privacy` | `(marketing)/privacy/page.tsx` | Privacy policy |
| `/terms` | `(marketing)/terms/page.tsx` | Terms of service |

Layout: `SiteHeader` (with mobile nav) + `SiteFooter`

### Customer Portal

| Route | File | Description |
|-------|------|-------------|
| `/repair/[token]` | `repair/[token]/page.tsx` | QR-accessible status page (mobile-first, no login) |

Layout: Minimal header (logo only). Modules: job-header, process-stepper, baseline-checklist, risk-reduction, safeguards-grid, update-log, pickup-instructions (shown when READY_FOR_PICKUP).

### Admin Console

| Route | File | Description |
|-------|------|-------------|
| `/admin` | `admin/page.tsx` | Redirects to dashboard if authenticated |
| `/admin/dashboard` | `admin/dashboard/page.tsx` | Ticket list with search, status filter, overdue badges |
| `/admin/tickets/new` | `admin/tickets/new/page.tsx` | Create ticket → QR modal → print receipt |
| `/admin/tickets/[id]` | `admin/tickets/[id]/page.tsx` | Full ticket detail — status, checklist, notes, add-ons, QR |

Layout: Auth gate (shows `LoginForm` if not authenticated) + sidebar (desktop) + mobile header. Login accepts any credentials (demo mode).

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root: html, body, Inter font, AuthProvider + TicketProvider
│   ├── globals.css                 # CSS vars (style guide) + panel/button component classes + print styles
│   ├── (marketing)/
│   │   ├── layout.tsx              # SiteHeader + SiteFooter wrapper
│   │   ├── page.tsx                # Home
│   │   ├── services/page.tsx
│   │   ├── process/page.tsx
│   │   ├── business/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── repair/
│   │   ├── layout.tsx              # Minimal header (logo only)
│   │   └── [token]/page.tsx        # Customer status page
│   └── admin/
│       ├── layout.tsx              # Auth gate + sidebar + mobile header
│       ├── page.tsx                # Redirect to dashboard
│       ├── dashboard/page.tsx
│       └── tickets/
│           ├── new/page.tsx
│           └── [id]/page.tsx
├── components/
│   ├── ui/                         # button, badge, card, panel, input, textarea, select, checkbox, dialog, separator
│   ├── layout/                     # site-header, site-footer, admin-sidebar, admin-header
│   ├── marketing/                  # hero-section, services-grid, process-timeline, trust-indicators, cta-banner, faq-accordion, contact-info
│   ├── repair/                     # job-header, process-stepper, baseline-checklist, risk-reduction, safeguard-card, safeguards-grid, update-log, pickup-instructions
│   ├── admin/                      # login-form, ticket-table, ticket-filters, ticket-form, status-updater, admin-checklist, notes-panel, addon-requests-panel, qr-display, qr-print-receipt
│   └── shared/                     # status-badge, page-heading
├── context/
│   ├── ticket-context.tsx          # React Context + useReducer — all ticket state + dispatch
│   └── auth-context.tsx            # Mock auth (boolean isAuthenticated)
├── hooks/
│   ├── use-tickets.ts              # CRUD operations wrapping ticket context
│   └── use-auth.ts                 # Thin wrapper around auth context
├── data/
│   ├── mock-tickets.ts             # 4 pre-seeded tickets (various statuses)
│   ├── mock-customers.ts           # 4 customers
│   ├── mock-devices.ts             # 4 devices
│   ├── addon-catalog.ts            # 5 safeguard items with pricing
│   ├── baseline-checklist.ts       # 12 plain-English checklist items + createChecklist()
│   ├── process-steps.ts            # 5 repair process steps
│   └── site-content.ts             # Marketing copy, FAQs, services, business services, contact info
├── lib/
│   ├── utils.ts                    # cn(), formatDate (deterministic), formatShortDate, isOverdue
│   ├── constants.ts                # STATUS_CONFIG (colors, labels, step numbers), SLA_THRESHOLD_HOURS, STATUS_ORDER
│   └── generate-token.ts           # nanoid wrapper, job number generator
└── types/
    └── index.ts                    # All TypeScript interfaces + RepairStatus enum

service/
├── ca-solutions.service            # systemd unit file (port 20100, user corey)
└── ca-manage.sh                    # Management script (install/start/stop/restart/status/logs/build)
```

---

## Data Model

### RepairStatus Enum (7 values)

`CHECKED_IN` → `DIAGNOSING` → `AWAITING_APPROVAL` → `REPAIR_IN_PROGRESS` → `VALIDATION` → `READY_FOR_PICKUP` → `CLOSED`

The process stepper shows 5 steps (AWAITING_APPROVAL maps to step 2 alongside DIAGNOSING, CLOSED maps to step 5 alongside READY_FOR_PICKUP).

### Key Interfaces

- **RepairTicket**: id, publicToken, jobNumber, customerId, deviceId, status, intakeNotes, checklistItems[], updateLog[], addOnRequests[], timestamps per status
- **Customer**: id, name, phone, email
- **Device**: id, type (laptop/desktop/tablet/other), make, model, serial?, conditionNotes?
- **AddOnCatalogItem**: id, name, description, whyItMatters, price, active
- **ChecklistItem**: id, label, checked
- **UpdateLogEntry**: id, timestamp, message, isInternal
- **AddOnRequest**: id, catalogItemId, status (requested/approved/declined), requestedAt, respondedAt?

### Pre-seeded Demo Data

| Job Number | Customer | Device | Status | Token |
|-----------|----------|--------|--------|-------|
| CA-20250210-001 | Sarah Mitchell | Dell Latitude 5530 | CHECKED_IN | `tk_Nq3kR7xBm2PvLwYs9Hj` |
| CA-20250209-002 | James Rodriguez | MacBook Pro 14" | REPAIR_IN_PROGRESS | `tk_Xp8mT4nAw6QrKcDf5Uy` |
| CA-20250207-003 | Linda Chen | HP Pavilion Desktop | READY_FOR_PICKUP | `tk_Gy7vJ2sEn9WqZmPk4Lt` |
| CA-20250208-004 | Mark Thompson | Surface Pro 9 | DIAGNOSING (overdue) | `tk_Bw5rC8hFx1MnUaVd3Ks` |

### Add-On Catalog (5 items)

| Name | Price | Description |
|------|-------|-------------|
| Data Backup Setup | $49 | Full backup before work begins |
| Performance Tune-Up | $79 | Startup optimization, bloatware removal |
| Security Hardening | $59 | Antivirus, firewall, browser security |
| Long-Term Monitoring Setup | $39 | Lightweight monitoring post-repair |
| Upgrade Evaluation | Free | RAM/storage/component assessment |

---

## State Management

### TicketContext (src/context/ticket-context.tsx)

Wraps entire app via root layout. Uses `useReducer` with these actions:

| Action | Purpose |
|--------|---------|
| `ADD_TICKET` | Admin creates new ticket |
| `UPDATE_STATUS` | Change status + auto-set timestamp for that status |
| `TOGGLE_CHECKLIST_ITEM` | Admin checks/unchecks a checklist item |
| `ADD_UPDATE_LOG` | Add customer-facing or internal note |
| `REQUEST_ADDON` | Customer requests a safeguard (from status page) |
| `RESPOND_ADDON` | Admin approves or declines an add-on request |

### AuthContext (src/context/auth-context.tsx)

Simple boolean `isAuthenticated` + `login()`/`logout()`. Login accepts any credentials. Admin layout shows `LoginForm` when not authenticated.

### Demo Loop (single browser session)

Both admin and customer portal share the same React Context, so changes in admin are immediately visible on the customer status page within the same browser session. State resets on refresh (no localStorage).

---

## Style Guide Implementation

### Colors (CSS Custom Properties in globals.css)

- **Primary**: `hsl(207 17% 37%)` — steel blue (#4F6473)
- **Accent**: `hsl(145 38% 56%)` — success green (#66B87A)
- **Background**: `hsl(220 20% 97%)` — light gray (#F5F6F8)
- **Foreground**: `hsl(220 10% 20%)` — dark text (#2F3237)
- **Border radius**: `0.15rem` (~2.4px) — intentionally subtle/sharp
- **Light mode only** (dark mode vars defined in style guide but not implemented)

### Component Patterns

- **Panel**: `.panel .panel-primary .panel-heading .panel-title .panel-body` — steel blue header cards used throughout repair status page
- **Button variants**: default, primary, success, destructive, outline, ghost, link — sizes: default, sm, xs, icon
- **Status badges**: Color-coded per status (blue/amber/orange/indigo/purple/green/gray)

### Font

Inter loaded via `next/font/google` as CSS variable `--font-inter`, applied via Tailwind `font-body` utility.

---

## Bugs Fixed

1. **Hydration mismatch** — `toLocaleDateString()` produces different output in Node.js vs browser. Fixed by replacing with deterministic manual date formatter in `src/lib/utils.ts`.
2. **Hydration mismatch (overdue)** — `Date.now()` in `isOverdue()` differs between server pre-render and client hydrate. Fixed by guarding behind `mounted` state in `ticket-table.tsx`.
3. **Build errors** — Removed unused imports (`ClipboardCheck`, `RepairStatus`, `Input`) that triggered ESLint `no-unused-vars`.
4. **Type error** — `lucide-react` namespace cast to `Record<string, ElementType>` failed TypeScript check. Fixed by using explicit `iconMap` with named imports.

---

## Known Issues / Technical Debt

1. **No dark mode** — CSS vars are in the style guide but `.dark` class switching is not implemented
2. **No real auth** — login accepts anything, no session persistence
3. **No data persistence** — state resets on refresh (intentional for Phase 0)
4. **Package name** — still `ca-solutions-scaffold` in package.json (cosmetic)
5. **No `generateStaticParams`** — dynamic routes (`[token]`, `[id]`) are server-rendered on demand, not pre-generated for seeded data
6. **No notifications** — PRD calls for email/SMS on status changes (Phase 1)
7. **No real customer/device creation** — ticket form uses dropdowns from mock data, no ability to add new customers or devices
8. **Print receipt** — print CSS exists but needs real-device testing

---

## PRD Alignment

### Phase 0 (Demo) — COMPLETE

- [x] Hard-coded mock data
- [x] Polished UI matching style guide
- [x] Marketing site (8 pages)
- [x] Customer status page with all modules (stepper, checklist, risk reduction, safeguards, updates, pickup)
- [x] Admin console (login, dashboard, create ticket + QR, ticket detail with all controls)
- [x] QR code generation with environment-aware URLs
- [x] Print receipt layout
- [x] Interactive demo loop (shared context)
- [x] Systemd service on port 20100
- [x] Cloudflare Tunnel integration (pending hostname config)

### Phase 1 (MVP) — NOT STARTED

- [ ] Real backend (Node.js API)
- [ ] PostgreSQL database (Prisma ORM)
- [ ] Real authentication (JWT + sessions)
- [ ] Real ticket creation with customer/device CRUD
- [ ] Email notifications on status changes
- [ ] Data persistence

### Phase 1.1 — NOT STARTED

- [ ] SMS notifications
- [ ] Approval workflow for add-ons
- [ ] Digital signature / terms acknowledgement

### Phase 2 — NOT STARTED

- [ ] Payments, invoices, service history
- [ ] Business accounts
- [ ] Automated completion summary PDFs

---

## Reference Files

- **PRD**: `/home/corey/projects/ca-solutions/PRD.md`
- **Style Guide**: `/home/corey/projects/ca-solutions/STYLE_GUIDE.md`
- **This Context**: `/home/corey/projects/ca-solutions/.context/CONTEXT.md`
