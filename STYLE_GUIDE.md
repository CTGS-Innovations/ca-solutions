# Computer Ally Innovation Hub - Style Guide

## Overview

This style guide documents the design system for the **Computer Ally Innovation Hub** application. The app is built with **Next.js** and **Tailwind CSS**, with a custom theme using CSS custom properties (HSL color space). It supports both **light** and **dark** modes.

---

## Typography

### Font Families

| Token        | Value                                              | Usage          |
| ------------ | -------------------------------------------------- | -------------- |
| `font-body`  | Inter, Arial, Helvetica, sans-serif                | Body text, UI  |
| `font-mono`  | ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace | Code, data     |

### Font Rendering

- Apply `antialiased` (font-smoothing) globally on `<body>`.

### Type Scale (Tailwind)

| Class      | Size    | Usage                        |
| ---------- | ------- | ---------------------------- |
| `text-xs`  | 0.75rem | Labels, captions, metadata   |
| `text-sm`  | 0.875rem| Secondary text, table cells  |
| `text-base`| 1rem    | Body text                    |
| `text-lg`  | 1.125rem| Subheadings                  |
| `text-xl`  | 1.25rem | Section headings             |
| `text-2xl` | 1.5rem  | Page headings                |
| `text-3xl` | 1.875rem| Hero/feature titles          |
| `text-4xl` | 2.25rem | Display text                 |

---

## Color System

All colors are defined as HSL values in CSS custom properties. Reference them via Tailwind utilities like `bg-primary`, `text-muted-foreground`, etc.

### Core Palette

#### Light Mode (Default)

| Token                        | HSL Value            | Hex (approx.)  | Usage                         |
| ---------------------------- | -------------------- | --------------- | ----------------------------- |
| `--background`               | 220 20% 97%         | `#F5F6F8`      | Page background               |
| `--foreground`               | 220 10% 20%         | `#2F3237`      | Primary text                  |
| `--card`                     | 0 0% 100%           | `#FFFFFF`      | Card backgrounds              |
| `--card-foreground`          | 220 10% 20%         | `#2F3237`      | Card text                     |
| `--popover`                  | 0 0% 100%           | `#FFFFFF`      | Popover/dropdown backgrounds  |
| `--popover-foreground`       | 220 10% 20%         | `#2F3237`      | Popover text                  |
| `--primary`                  | 207 17% 37%         | `#4F6473`      | Primary brand color           |
| `--primary-foreground`       | 0 0% 98%            | `#FAFAFA`      | Text on primary               |
| `--secondary`                | 210 15% 90%         | `#E1E5EA`      | Secondary surfaces            |
| `--secondary-foreground`     | 210 10% 40%         | `#5C6570`      | Text on secondary             |
| `--muted`                    | 220 15% 90%         | `#E1E4EA`      | Muted/subtle backgrounds      |
| `--muted-foreground`         | 220 10% 50%         | `#737980`      | De-emphasized text            |
| `--accent`                   | 145 38% 56%         | `#66B87A`      | Accent / success green        |
| `--accent-foreground`        | 0 0% 100%           | `#FFFFFF`      | Text on accent                |
| `--destructive`              | 0 84.2% 60.2%       | `#EF4444`      | Error / destructive actions   |
| `--destructive-foreground`   | 0 0% 98%            | `#FAFAFA`      | Text on destructive           |
| `--border`                   | 210 20% 80%         | `#BFC8D1`      | Borders, dividers             |
| `--input`                    | 0 0% 100%           | `#FFFFFF`      | Input field backgrounds       |
| `--ring`                     | 207 17% 45%         | `#5F7585`      | Focus rings                   |
| `--radius`                   | 0.15rem             | ~2.4px         | Default border radius         |

#### Dark Mode

| Token                        | HSL Value            | Hex (approx.)  | Usage                         |
| ---------------------------- | -------------------- | --------------- | ----------------------------- |
| `--background`               | 220 10% 10%         | `#171819`      | Page background               |
| `--foreground`               | 220 10% 90%         | `#E3E4E6`      | Primary text                  |
| `--card`                     | 220 10% 12%         | `#1C1D1F`      | Card backgrounds              |
| `--card-foreground`          | 220 10% 90%         | `#E3E4E6`      | Card text                     |
| `--primary`                  | 207 17% 28%         | `#3B4D59`      | Primary brand color           |
| `--primary-foreground`       | 0 0% 95%            | `#F2F2F2`      | Text on primary               |
| `--secondary`                | 210 15% 25%         | `#363D44`      | Secondary surfaces            |
| `--secondary-foreground`     | 0 0% 90%            | `#E6E6E6`      | Text on secondary             |
| `--muted`                    | 220 10% 20%         | `#2F3237`      | Muted/subtle backgrounds      |
| `--muted-foreground`         | 220 8% 60%          | `#939699`      | De-emphasized text            |
| `--accent`                   | 145 38% 56%         | `#66B87A`      | Accent (unchanged)            |
| `--destructive`              | 0 70% 50%           | `#D93636`      | Error / destructive actions   |
| `--border`                   | 210 15% 35%         | `#4B5563`      | Borders, dividers             |
| `--input`                    | 220 10% 18%         | `#282A2E`      | Input field backgrounds       |
| `--ring`                     | 207 17% 35%         | `#4A5C68`      | Focus rings                   |

### Specialized Colors

#### Button Action Colors (Light Mode)

| Token                                    | HSL Value          | Hex (approx.)  | Usage                |
| ---------------------------------------- | ------------------ | --------------- | -------------------- |
| `--button-success-background`            | 145 38% 56%       | `#66B87A`      | Success actions      |
| `--button-success-foreground`            | 0 0% 100%         | `#FFFFFF`      | Text on success      |
| `--button-action-green-background`       | 145 38% 56%       | `#66B87A`      | Green action buttons |
| `--button-action-green-foreground`       | 0 0% 100%         | `#FFFFFF`      | Text on green        |
| `--button-action-light-blue-background`  | 198 65% 60%       | `#53B8DB`      | Light blue actions   |
| `--button-action-light-blue-foreground`  | 0 0% 100%         | `#FFFFFF`      | Text on light blue   |

#### Panel Colors (Light Mode)

| Token                              | HSL Value          | Hex (approx.)  | Usage              |
| ---------------------------------- | ------------------ | --------------- | ------------------ |
| `--panel-primary-background`       | 207 17% 37%       | `#4F6473`      | Panel headers      |
| `--panel-primary-foreground`       | 0 0% 98%          | `#FAFAFA`      | Panel header text  |

#### EPC Dashboard Colors (Light Mode)

| Token                                      | HSL Value        | Hex (approx.)  | Usage               |
| ------------------------------------------ | ---------------- | --------------- | -------------------- |
| `--epc-dashboard-header-background`        | 206 76% 48%     | `#1D8FD6`      | Dashboard header     |
| `--epc-dashboard-button-teal-background`   | 175 58% 40%     | `#2BA098`      | Teal action buttons  |
| `--epc-dashboard-filter-bar-background`    | 220 10% 35%     | `#515459`      | Filter bar           |

### Chart Colors

| Token       | Light Mode HSL   | Light Hex   | Dark Mode HSL    | Dark Hex    |
| ----------- | ---------------- | ----------- | ---------------- | ----------- |
| `--chart-1` | 12 76% 61%      | `#E07850`   | 220 70% 50%     | `#2666D9`   |
| `--chart-2` | 173 58% 39%     | `#29A08F`   | 160 60% 45%     | `#2EB88A`   |
| `--chart-3` | 197 37% 24%     | `#264053`   | 30 80% 55%      | `#E0933D`   |
| `--chart-4` | 43 74% 66%      | `#E0C55C`   | 280 65% 60%     | `#A64DD9`   |
| `--chart-5` | 27 87% 67%      | `#F09650`   | 340 75% 55%     | `#D9337A`   |

### Sidebar Colors

| Token                          | Light Mode HSL       | Dark Mode HSL         |
| ------------------------------ | -------------------- | --------------------- |
| `--sidebar-background`         | 0 0% 98%            | 240 5.9% 10%         |
| `--sidebar-foreground`         | 240 5.3% 26.1%      | 240 4.8% 95.9%       |
| `--sidebar-primary`            | 240 5.9% 10%        | 224.3 76.3% 48%      |
| `--sidebar-primary-foreground` | 0 0% 98%            | 0 0% 100%            |
| `--sidebar-accent`             | 240 4.8% 95.9%      | 240 3.7% 15.9%       |
| `--sidebar-accent-foreground`  | 240 5.9% 10%        | 240 4.8% 95.9%       |
| `--sidebar-border`             | 220 13% 91%         | 240 3.7% 15.9%       |
| `--sidebar-ring`               | 217.2 91.2% 59.8%   | 217.2 91.2% 59.8%    |

---

## Spacing & Layout

### Border Radius

- Default radius: `--radius: 0.15rem` (~2.4px) - intentionally subtle/sharp
- Use Tailwind `rounded-*` utilities mapped to this variable where applicable

### Layout Patterns

- **Full-page centering**: `flex items-center justify-center min-h-screen`
- **Sidebar layout**: Collapsible sidebar with custom widths via data-attributes
- **Responsive breakpoints**: `sm`, `md`, `lg` (standard Tailwind breakpoints)

---

## Components

### Panels

Panels are a core UI pattern used for grouped content sections.

```html
<div class="panel panel-primary">
  <div class="panel-heading">
    <h3 class="panel-title">Section Title</h3>
  </div>
  <div class="panel-body">
    <!-- Content -->
  </div>
</div>
```

| Class            | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| `.panel`         | Base panel with border, shadow, and margin                      |
| `.panel-primary` | Panel with primary-colored border                               |
| `.panel-heading` | Header area with `--panel-primary-background`, padded           |
| `.panel-title`   | Flex layout title with icon spacing                             |
| `.panel-body`    | Content area with card background and padding                   |

### Buttons

```html
<button class="btn">Default</button>
<button class="btn btn-success">Save</button>
<button class="btn btn-xs">Small</button>
<button class="btn btn-icon">...</button>
<button class="btn btn-link">Link Style</button>
```

| Class          | Description                                        |
| -------------- | -------------------------------------------------- |
| `.btn`         | Base button with transitions and standard padding  |
| `.btn-success` | Green success button (`--button-success-background`) |
| `.btn-xs`      | Extra-small variant                                |
| `.btn-icon`    | Square 2rem icon-only button                       |
| `.btn-link`    | Text-link styled button (no background)            |

### Toaster (Notifications)

The app uses a `Toaster` component for toast notifications (likely from `sonner` or `react-hot-toast`).

### Feedback Widget

A `ConditionalFeedbackWidget` component is present globally for user feedback collection.

---

## Animations

| Name              | Duration | Description                              | Usage                 |
| ----------------- | -------- | ---------------------------------------- | --------------------- |
| `spin`            | -        | 360deg continuous rotation               | Loading spinners      |
| `ping`            | -        | Scale 2x + fade to 0 opacity            | Notification dots     |
| `pulse`           | -        | Scale + box-shadow oscillation           | Attention indicators  |
| `progress-fill`   | -        | scaleX(0) to scaleX(1)                  | Progress bars         |
| `accordion-down`  | 0.2s     | Height expand from 0                     | Accordion open        |
| `accordion-up`    | 0.2s     | Height collapse to 0                     | Accordion close       |
| `enter`           | -        | Opacity + translate + scale + rotate in  | Element entrance      |
| `exit`            | -        | Opacity + translate + scale + rotate out | Element exit          |

### Loading Spinner Example

```html
<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
```

---

## Dark Mode

Dark mode is activated via the `.dark` class on a parent element (typically `<html>`). The theme system swaps all CSS custom property values automatically.

**Key differences in dark mode:**
- Backgrounds shift from light grays (`97%` lightness) to dark (`10-12%`)
- Text shifts from dark (`20%`) to light (`90%`)
- Primary color darkens slightly (`37%` -> `28%` lightness)
- Chart colors change completely for better contrast on dark backgrounds
- Border and input colors invert appropriately

---

## Third-Party Integrations

| Library            | Purpose                          |
| ------------------ | -------------------------------- |
| **Tailwind CSS**   | Utility-first CSS framework      |
| **Recharts**       | Chart/data visualization         |
| **react-pdf**      | PDF viewing                      |
| **Cloudflare**     | CDN, analytics, Rocket Loader    |

---

## Usage Notes

1. **Always use CSS variables** for colors, not hardcoded values. This ensures dark mode compatibility.
2. **Border radius is intentionally small** (0.15rem). The design favors sharp, clean edges.
3. **Inter** is the primary typeface. Ensure it's loaded via the Next.js font system.
4. **Panel components** are a domain-specific pattern — use them for grouped data sections (dashboards, forms, etc.).
5. **The color palette is muted and professional** — steel blues, soft greens, neutral grays. Avoid introducing saturated or bright colors outside of chart/data contexts.
