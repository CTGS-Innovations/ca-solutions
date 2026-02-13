# Computer Ally — WordPress + Elementor Conversion

This folder contains everything needed to run the Computer Ally site on WordPress with Elementor Pro.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  WordPress + Elementor Pro                                   │
├──────────────────┬──────────────────┬───────────────────────┤
│  Hello Elementor │  Computer Ally   │  Computer Ally Core   │
│  (Parent Theme)  │  Child Theme     │  Plugin               │
│                  │                  │                       │
│  Base framework  │  Design tokens   │  CPTs (Tickets,       │
│  for Elementor   │  CSS variables   │    Customers, Devices)│
│                  │  Typography      │  REST API             │
│                  │  Component CSS   │  QR Code generation   │
│                  │  Nav menus       │  Shortcodes           │
│                  │                  │  Repair status portal │
│                  │                  │  Admin meta boxes     │
│                  │                  │  Dashboard widget     │
└──────────────────┴──────────────────┴───────────────────────┘
```

**Marketing pages** (Home, Services, Process, Business, FAQ, Contact, Privacy, Terms) are built visually in Elementor using a mix of Elementor widgets and plugin shortcodes.

**Repair status portal** (`/repair/{token}`) is fully rendered by the plugin — no Elementor building needed.

**Admin ticket management** uses native WordPress admin with custom post types, meta boxes, and list table columns.

---

## Folder Structure

```
wordpress/
├── README.md                          ← You are here
├── theme/
│   └── computerally-child/            ← Hello Elementor child theme
│       ├── style.css                  Design system (colors, panels, badges, etc.)
│       └── functions.php              Enqueue styles, menus, Elementor integration
├── plugin/
│   └── computer-ally-core/            ← Custom functionality plugin
│       ├── computer-ally-core.php     Plugin bootstrap, constants, rewrite rules
│       ├── includes/
│       │   ├── post-types.php         CPTs: ca_ticket, ca_customer, ca_device
│       │   ├── taxonomies.php         Taxonomy: ca_device_type
│       │   ├── meta-fields.php        All custom meta + meta boxes + save handlers
│       │   ├── repair-statuses.php    Status definitions, process steps, addon catalog
│       │   ├── shortcodes.php         9 shortcodes for Elementor pages
│       │   ├── qr-codes.php           QR generation + print receipt rendering
│       │   ├── rest-api.php           REST endpoints for ticket operations
│       │   └── admin/
│       │       ├── dashboard.php      WP Dashboard overview widget
│       │       └── ticket-columns.php Custom list columns, sorting, filtering
│       ├── templates/
│       │   └── repair-status.php      Customer portal template (full page)
│       └── assets/
│           ├── css/
│           │   ├── frontend.css       Portal responsive styles
│           │   └── admin.css          Admin UI enhancements
│           └── js/
│               ├── frontend.js        Add-on request button handler
│               └── admin.js           Ticket form helpers
├── elementor-templates/
│   └── pages.md                       Page-by-page Elementor build guide
└── database/
    └── seed-data.sql                  WP-CLI commands to create demo data
```

---

## Installation

### Prerequisites

- WordPress 6.0+
- PHP 8.0+
- **Hello Elementor** theme (free from WordPress.org)
- **Elementor Pro** (required for Theme Builder — header/footer)

### Step 1: Install the Child Theme

1. Copy `theme/computerally-child/` to `wp-content/themes/`
2. In WordPress admin: **Appearance > Themes**
3. Activate **Computer Ally** (it will auto-require Hello Elementor as parent)

### Step 2: Install the Plugin

1. Copy `plugin/computer-ally-core/` to `wp-content/plugins/`
2. In WordPress admin: **Plugins > Installed Plugins**
3. Activate **Computer Ally Core**
4. The plugin will:
   - Register Custom Post Types (Tickets, Customers, Devices)
   - Create a `/repair-status` page with the shortcode
   - Set up URL rewrite for `/repair/{token}`
5. Go to **Settings > Permalinks** and click **Save** (flushes rewrites)

### Step 3: Configure Elementor

1. Go to **Elementor > Site Settings > Global Colors**
   - Add the colors from the design system (see `elementor-templates/pages.md`)
2. Go to **Elementor > Site Settings > Global Fonts**
   - Set Primary font to **Inter**
3. Build the **Header** and **Footer** in Theme Builder
   - See the Global Setup section in `elementor-templates/pages.md`

### Step 4: Create Pages

Create these WordPress pages and build them in Elementor:

| Page              | Slug       | Template         |
|-------------------|------------|------------------|
| Home              | `/`        | Default          |
| Services          | `services` | Default          |
| Our Process       | `process`  | Default          |
| Business Services | `business` | Default          |
| FAQ               | `faq`      | Default          |
| Contact           | `contact`  | Default          |
| Privacy Policy    | `privacy`  | Default          |
| Terms of Service  | `terms`    | Default          |
| Repair Status     | *(auto-created)* | Canvas    |

Follow the detailed build guide in `elementor-templates/pages.md`.

### Step 5: Seed Demo Data (Optional)

Use the WP-CLI commands in `database/seed-data.sql` to create the same demo tickets, customers, and devices as the Next.js version.

### Step 6: Set Up Navigation

1. **Appearance > Menus**: Create a Primary menu with:
   Services | Our Process | Business | FAQ | Contact
2. Assign to the "Primary Navigation" location

---

## Available Shortcodes

These shortcodes can be placed in any Elementor Shortcode widget or page content:

| Shortcode            | Description                                      |
|----------------------|--------------------------------------------------|
| `[ca_repair_status]` | Full customer repair portal (reads token from URL)|
| `[ca_process_steps]` | 5-step repair process timeline                   |
| `[ca_services_grid]` | 6 service cards in responsive grid               |
| `[ca_trust_stats]`   | 4 trust indicator stat boxes                     |
| `[ca_faq]`           | 8-item FAQ accordion                             |
| `[ca_contact_info]`  | 4 contact info cards (hours, location, etc.)     |
| `[ca_cta_banner]`    | Call-to-action banner (customizable via attrs)    |
| `[ca_safeguards]`    | Add-on safeguards grid with pricing              |
| `[ca_checklist]`     | Baseline checklist (12 items included free)      |

### CTA Banner Attributes

```
[ca_cta_banner
  title="Ready to Get Your Computer Fixed?"
  text="Drop off your device and track every step."
  button_text="Contact Us"
  button_url="/contact"
]
```

---

## REST API Endpoints

### Public (No Authentication)

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/wp-json/ca/v1/repair/{token}`   | Get ticket data by token       |
| POST   | `/wp-json/ca/v1/repair/{token}/addon` | Customer requests an add-on |

### Admin (Requires `edit_posts` capability)

| Method | Endpoint                              | Description                    |
|--------|---------------------------------------|--------------------------------|
| POST   | `/wp-json/ca/v1/tickets/{id}/status`  | Update ticket status           |
| POST   | `/wp-json/ca/v1/tickets/{id}/checklist` | Toggle checklist item        |
| POST   | `/wp-json/ca/v1/tickets/{id}/note`    | Add update log entry           |
| POST   | `/wp-json/ca/v1/tickets/{id}/addon`   | Approve/decline add-on request |

---

## Custom Post Types

### Repair Tickets (`ca_ticket`)

**Admin Location:** Repair Tickets (main menu)

**Meta Fields:**
- `_ca_public_token` — Auto-generated unique token for customer URL
- `_ca_job_number` — Auto-generated job number (CA-YYYYMMDD-NNN)
- `_ca_customer_id` — Linked Customer post ID
- `_ca_device_id` — Linked Device post ID
- `_ca_status` — Repair status enum
- `_ca_intake_notes` — Notes from intake
- `_ca_checklist` — JSON array of checklist items
- `_ca_update_log` — JSON array of log entries
- `_ca_addon_requests` — JSON array of add-on requests
- `_ca_checked_in_at` through `_ca_closed_at` — Status timestamps

### Customers (`ca_customer`)

**Admin Location:** Repair Tickets > Customers (submenu)

**Meta Fields:**
- `_ca_phone` — Phone number
- `_ca_email` — Email address

### Devices (`ca_device`)

**Admin Location:** Repair Tickets > Devices (submenu)

**Meta Fields:**
- `_ca_make` — Manufacturer
- `_ca_model` — Model name
- `_ca_serial` — Serial number
- `_ca_condition_notes` — Intake condition notes

**Taxonomy:** `ca_device_type` (Laptop, Desktop, Tablet, Other)

---

## Status Workflow

```
CHECKED_IN → DIAGNOSING → AWAITING_APPROVAL → REPAIR_IN_PROGRESS → VALIDATION → READY_FOR_PICKUP → CLOSED
     1            2               2                    3                4               5              5
```

Each status change auto-records a timestamp. Tickets open longer than 48 hours are flagged as **OVERDUE** in the admin list.

---

## Design System Reference

### Colors

| Token              | Hex       | HSL                  | Usage              |
|--------------------|-----------|----------------------|--------------------|
| Primary            | `#4F6473` | `207 17% 37%`       | Steel blue         |
| Primary Hover      | `#445668` | `207 17% 32%`       | Darker steel       |
| Accent             | `#66B87A` | `145 38% 56%`       | Success green      |
| Background         | `#F5F6F8` | `220 20% 97%`       | Page bg            |
| Foreground         | `#2F3237` | `220 10% 20%`       | Body text          |
| Card               | `#FFFFFF` | `0 0% 100%`         | Card bg            |
| Border             | `#BFC8D1` | `210 20% 80%`       | Dividers           |
| Muted Foreground   | `#6B7280` | `220 10% 50%`       | Secondary text     |

### Typography

- **Font:** Inter (Google Fonts)
- **Body:** 400 weight, 0.875rem-1rem
- **Headings:** 600-700 weight
- **Border Radius:** 0.15rem (intentionally sharp/subtle)

### CSS Classes (Available from child theme)

- `.ca-panel`, `.ca-panel-primary`, `.ca-panel-heading`, `.ca-panel-title`, `.ca-panel-body`
- `.ca-btn`, `.ca-btn-primary`, `.ca-btn-success`, `.ca-btn-outline`, `.ca-btn-sm`, `.ca-btn-xs`
- `.ca-badge`, `.ca-badge-checked-in`, `.ca-badge-diagnosing`, etc.
- `.ca-card`, `.ca-card-header`, `.ca-card-title`, `.ca-card-body`
- `.ca-stepper`, `.ca-stepper-step`, `.ca-stepper-circle`, etc.
- `.ca-trust-grid`, `.ca-trust-item`, `.ca-trust-stat`, `.ca-trust-label`
- `.ca-services-grid`
- `.ca-cta-banner`

---

## Migration from Next.js

| Next.js Concept           | WordPress Equivalent                          |
|---------------------------|-----------------------------------------------|
| React Context state       | WordPress post meta + REST API                |
| App Router pages          | Elementor pages                               |
| React components          | Shortcodes + Elementor widgets                |
| `globals.css` variables   | Child theme `style.css` CSS variables         |
| Mock data                 | Custom Post Types with meta fields            |
| `next/font` (Inter)       | Google Fonts via `functions.php`              |
| QR via `qrcode.react`     | QR via goqr.me API (or PHP lib for local gen) |
| Admin auth gate           | WordPress native authentication               |
| `lucide-react` icons      | Elementor icons or Dashicons                  |
| Client-side routing       | Standard WordPress page loads                 |
| Tailwind utility classes  | Child theme component CSS classes             |

---

## Next Steps (Phase 1)

The WordPress version replaces the Next.js demo with persistent, production-ready data:

- [ ] Configure email notifications (WP Mail SMTP + custom hooks on status change)
- [ ] Add SMS notifications (Twilio plugin or custom integration)
- [ ] Build customer login for returning customers
- [ ] Add payment integration (WooCommerce or Stripe plugin)
- [ ] Set up automated backup with UpdraftPlus
- [ ] Configure caching (LiteSpeed / WP Fastest Cache)
- [ ] SSL + Cloudflare CDN
