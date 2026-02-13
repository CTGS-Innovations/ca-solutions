# Elementor Page Templates — Build Guide

This document provides the exact structure for building each page in Elementor Pro.
Use the **Computer Ally child theme** and the **Computer Ally Core** plugin together.

All pages use the Elementor Canvas or Default template unless noted otherwise.

---

## Global Setup (Do This First)

### 1. Site Settings (Elementor > Site Settings)

**Global Colors:**

| Name         | Hex       | CSS Var              | Usage                      |
|--------------|-----------|----------------------|----------------------------|
| Primary      | `#4F6473` | `--ca-primary`       | Headers, buttons, links    |
| Accent       | `#66B87A` | `--ca-accent`        | Success, CTAs, checkmarks  |
| Background   | `#F5F6F8` | `--ca-background`    | Page background            |
| Text         | `#2F3237` | `--ca-foreground`    | Body text                  |
| Muted        | `#6B7280` | `--ca-muted-foreground` | Secondary text          |
| Card         | `#FFFFFF` | `--ca-card`          | Card backgrounds           |
| Border       | `#BFC8D1` | `--ca-border`        | Borders, dividers          |
| Destructive  | `#EF4444` | `--ca-destructive`   | Errors, overdue            |

**Global Fonts:**
- Primary: **Inter** (400, 500, 600, 700)
- Secondary: System default

**Default Container:**
- Max Width: 1200px
- Padding: 2rem (horizontal)

---

### 2. Header (Elementor Theme Builder > Header)

**Condition:** Entire Site (exclude Repair Status page template)

**Structure:**
```
Section (Sticky, Z-index: 50, Background: white, Border-bottom: 1px solid #BFC8D1)
└── Container (Max Width 1200px, Flex Row, Space Between)
    ├── Site Logo or Text: "Computer Ally" (Inter 700, 1.25rem, #4F6473)
    └── Nav Menu Widget
        Links: Services | Our Process | Business | FAQ | Contact
        Style: Inter 500, 0.875rem, #2F3237
        Hover: #4F6473
        Mobile: Hamburger menu
```

### 3. Footer (Elementor Theme Builder > Footer)

**Condition:** Entire Site

**Structure:**
```
Section (Background: #2F3237, Padding: 3rem 0 1.5rem, Color: #9CA3AF)
└── Container (Max Width 1200px)
    ├── Row: 4 Columns
    │   ├── Col 1: "Computer Ally" + tagline
    │   ├── Col 2: "Services" links
    │   ├── Col 3: "Support" links (FAQ, Contact, Check Status)
    │   └── Col 4: "Legal" links (Privacy, Terms)
    └── Row: Bottom bar
        └── "© 2025 Computer Ally. All rights reserved." (centered, 0.75rem)
```

---

## Page-by-Page Build Instructions

---

### HOME PAGE (`/`)

**Template:** Default (with header/footer)

```
Section: HERO
├── Background: #4F6473 (primary)
├── Padding: 5rem 2rem
├── Text Align: Center
├── Heading: "Computer Repair You Can Actually See"
│   Font: Inter 700, 2.5rem (mobile: 1.75rem), White
├── Text: "Drop off. Scan your QR code. Track every step. Pick up with confidence."
│   Font: Inter 400, 1.125rem, White (opacity 90%)
└── Button Group (centered, gap 1rem)
    ├── Button 1: "Check Repair Status" → /repair-status
    │   Style: Background #66B87A, White text, rounded
    └── Button 2: "Our Process" → /process
        Style: Outline white border, White text

Section: TRUST INDICATORS
├── Padding: 3rem 2rem
├── Background: #F5F6F8
└── Shortcode Widget: [ca_trust_stats]
    (OR build manually with 4 Counter widgets in a row)

Section: PROCESS OVERVIEW
├── Padding: 4rem 2rem
├── Heading: "How It Works" (centered)
└── Shortcode Widget: [ca_process_steps]
    (OR build manually with Icon List or Timeline widget)

Section: SERVICES
├── Padding: 4rem 2rem
├── Heading: "What We Fix" (centered)
└── Shortcode Widget: [ca_services_grid]
    (OR build with 6 Icon Box widgets in 3-column grid)

Section: CTA BANNER
└── Shortcode Widget: [ca_cta_banner]
    (OR build manually — see Global Setup)
```

---

### SERVICES PAGE (`/services`)

```
Section: Page Header
├── Padding: 3rem 2rem
├── Heading: "Our Services"
└── Text: "Professional computer repair services for home and business."

Section: Services Grid
└── Shortcode: [ca_services_grid]

Section: CTA
└── Shortcode: [ca_cta_banner title="Need a Repair?" text="Walk-ins welcome. No appointment necessary." button_text="Contact Us" button_url="/contact"]
```

---

### PROCESS PAGE (`/process`)

```
Section: Page Header
├── Heading: "Our Process"
└── Text: "Every repair follows the same thorough, transparent process."

Section: Process Timeline
└── Shortcode: [ca_process_steps]

Section: Baseline Checklist
├── Heading: "What's Included With Every Repair"
└── Shortcode: [ca_checklist]

Section: CTA
└── Shortcode: [ca_cta_banner]
```

---

### BUSINESS PAGE (`/business`)

```
Section: Page Header
├── Heading: "Business Services"
└── Text: "Tailored IT support for businesses that can't afford downtime."

Section: Business Services Grid (3 columns)
├── Card 1: "Priority Service" — Business clients get priority queue...
├── Card 2: "Fleet Management" — Multi-device intake, tracking...
├── Card 3: "On-Site Support" — We come to your office...
├── Card 4: "Scheduled Maintenance" — Preventive maintenance plans...
├── Card 5: "Invoice & NET Terms" — Flexible invoicing with NET-15...
└── Card 6: "Dedicated Account Manager" — A single point of contact...

(Use Elementor Icon Box widgets in a 3-col grid with card styling)

Section: CTA
└── Shortcode: [ca_cta_banner title="Ready to Streamline Your IT?" text="Contact us about business pricing and priority service." button_text="Get in Touch" button_url="/contact"]
```

---

### FAQ PAGE (`/faq`)

```
Section: Page Header
├── Heading: "Frequently Asked Questions"
└── Text: "Common questions about our repair process and services."

Section: FAQ List
└── Shortcode: [ca_faq]
    (OR use Elementor Accordion widget with the 8 Q&A pairs)

Section: CTA
└── Shortcode: [ca_cta_banner title="Still Have Questions?" text="We're happy to help." button_text="Contact Us" button_url="/contact"]
```

---

### CONTACT PAGE (`/contact`)

```
Section: Page Header
├── Heading: "Contact Us"
└── Text: "We're here to help with all your computer repair needs."

Section: Contact Info
└── Shortcode: [ca_contact_info]
    (OR build manually with 4 Icon Box widgets in 2x2 grid)
```

---

### PRIVACY POLICY (`/privacy`)

```
Section: Page Header
├── Heading: "Privacy Policy"
└── Text: "Effective February 1, 2025"

Section: Content
└── Text Editor widget with full privacy policy content
    (Copy from src/app/(marketing)/privacy/page.tsx)
```

---

### TERMS OF SERVICE (`/terms`)

```
Section: Page Header
├── Heading: "Terms of Service"
└── Text: "Effective February 1, 2025"

Section: Content
└── Text Editor widget with full terms content
    (Copy from src/app/(marketing)/terms/page.tsx)
```

---

### REPAIR STATUS PAGE (`/repair-status`)

**Template:** Elementor Canvas (no header/footer — minimal layout)

This page is auto-created by the plugin with the `[ca_repair_status]` shortcode.

**Custom header for this page only (optional):**
Build a separate Elementor header template with condition "Singular > Repair Status" that shows just the logo, no navigation.

```
The plugin handles ALL rendering via the shortcode.
The page reads the token from the URL: /repair/{token}

No Elementor building needed — the plugin template handles:
- Job header with status badge
- Process stepper
- Baseline checklist with progress bar
- Risk reduction cards
- Safeguards grid with request buttons
- Update log
- Pickup instructions (conditional)
```

---

## Elementor Pro Widgets Used

| Widget             | Pages Used On                  |
|--------------------|-------------------------------|
| Heading            | All pages                     |
| Text Editor        | All pages, Privacy, Terms     |
| Button             | Hero, CTA sections            |
| Icon Box           | Services, Business, Contact   |
| Counter            | Trust indicators              |
| Accordion          | FAQ (alternative to shortcode)|
| Nav Menu           | Header                        |
| Site Logo          | Header                        |
| Shortcode          | All pages (plugin shortcodes) |
| Container/Section  | All pages (layout)            |

---

## Recommended Plugins

| Plugin                        | Purpose                              |
|-------------------------------|--------------------------------------|
| Elementor Pro                 | Page builder + Theme Builder         |
| Hello Elementor (theme)       | Base theme for Elementor             |
| Computer Ally Core (custom)   | Tickets, QR, REST API, shortcodes    |
| WP Mail SMTP                  | Reliable email delivery              |
| Wordfence                     | Security                             |
| UpdraftPlus                   | Backups                              |
| WP Fastest Cache / LiteSpeed  | Performance caching                  |
