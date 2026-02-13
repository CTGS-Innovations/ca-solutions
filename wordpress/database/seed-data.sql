-- ============================================================
-- Computer Ally — Seed Data for WordPress
-- ============================================================
-- Run after activating the Computer Ally Core plugin.
-- This creates the same demo data as the Next.js mock data.
--
-- NOTE: Post IDs will vary based on your WordPress install.
-- Run this via WP-CLI or phpMyAdmin, then update meta references.
--
-- Alternatively, use the WP-CLI commands below instead of raw SQL.
-- ============================================================

-- ============================================================
-- OPTION 1: WP-CLI Commands (Recommended)
-- ============================================================
-- Copy and paste these into your terminal.
-- Adjust paths if wp-cli is not in your PATH.

/*

# ── Create Customers ────────────────────────────────────────

wp post create --post_type=ca_customer --post_title="Sarah Mitchell" --post_status=publish
wp post meta update <SARAH_ID> _ca_phone "(555) 234-5678"
wp post meta update <SARAH_ID> _ca_email "sarah.mitchell@email.com"

wp post create --post_type=ca_customer --post_title="James Rodriguez" --post_status=publish
wp post meta update <JAMES_ID> _ca_phone "(555) 345-6789"
wp post meta update <JAMES_ID> _ca_email "james.rodriguez@email.com"

wp post create --post_type=ca_customer --post_title="Linda Chen" --post_status=publish
wp post meta update <LINDA_ID> _ca_phone "(555) 456-7890"
wp post meta update <LINDA_ID> _ca_email "linda.chen@email.com"

wp post create --post_type=ca_customer --post_title="Mark Thompson" --post_status=publish
wp post meta update <MARK_ID> _ca_phone "(555) 567-8901"
wp post meta update <MARK_ID> _ca_email "mark.thompson@email.com"

# ── Create Devices ──────────────────────────────────────────

wp post create --post_type=ca_device --post_title="Dell Latitude 5530" --post_status=publish
wp post meta update <DELL_ID> _ca_make "Dell"
wp post meta update <DELL_ID> _ca_model "Latitude 5530"

wp post create --post_type=ca_device --post_title="MacBook Pro 14\"" --post_status=publish
wp post meta update <MAC_ID> _ca_make "Apple"
wp post meta update <MAC_ID> _ca_model "MacBook Pro 14\""

wp post create --post_type=ca_device --post_title="HP Pavilion Desktop" --post_status=publish
wp post meta update <HP_ID> _ca_make "HP"
wp post meta update <HP_ID> _ca_model "Pavilion Desktop"

wp post create --post_type=ca_device --post_title="Surface Pro 9" --post_status=publish
wp post meta update <SURFACE_ID> _ca_make "Microsoft"
wp post meta update <SURFACE_ID> _ca_model "Surface Pro 9"

# ── Create Tickets ──────────────────────────────────────────

wp post create --post_type=ca_ticket --post_title="CA-20250210-001 — Sarah Mitchell" --post_status=publish
wp post meta update <TK1_ID> _ca_public_token "tk_Nq3kR7xBm2PvLwYs9Hj"
wp post meta update <TK1_ID> _ca_job_number "CA-20250210-001"
wp post meta update <TK1_ID> _ca_customer_id <SARAH_ID>
wp post meta update <TK1_ID> _ca_device_id <DELL_ID>
wp post meta update <TK1_ID> _ca_status "CHECKED_IN"
wp post meta update <TK1_ID> _ca_intake_notes "Customer reports intermittent blue screens over the past week."
wp post meta update <TK1_ID> _ca_checked_in_at "2025-02-10T10:30:00-05:00"

wp post create --post_type=ca_ticket --post_title="CA-20250209-002 — James Rodriguez" --post_status=publish
wp post meta update <TK2_ID> _ca_public_token "tk_Xp8mT4nAw6QrKcDf5Uy"
wp post meta update <TK2_ID> _ca_job_number "CA-20250209-002"
wp post meta update <TK2_ID> _ca_customer_id <JAMES_ID>
wp post meta update <TK2_ID> _ca_device_id <MAC_ID>
wp post meta update <TK2_ID> _ca_status "REPAIR_IN_PROGRESS"
wp post meta update <TK2_ID> _ca_intake_notes "Screen flickering and occasional kernel panic."
wp post meta update <TK2_ID> _ca_checked_in_at "2025-02-09T14:00:00-05:00"
wp post meta update <TK2_ID> _ca_diagnosing_at "2025-02-09T15:30:00-05:00"
wp post meta update <TK2_ID> _ca_in_progress_at "2025-02-10T09:00:00-05:00"

wp post create --post_type=ca_ticket --post_title="CA-20250207-003 — Linda Chen" --post_status=publish
wp post meta update <TK3_ID> _ca_public_token "tk_Gy7vJ2sEn9WqZmPk4Lt"
wp post meta update <TK3_ID> _ca_job_number "CA-20250207-003"
wp post meta update <TK3_ID> _ca_customer_id <LINDA_ID>
wp post meta update <TK3_ID> _ca_device_id <HP_ID>
wp post meta update <TK3_ID> _ca_status "READY_FOR_PICKUP"
wp post meta update <TK3_ID> _ca_intake_notes "Desktop won't boot. Power light comes on but no display."
wp post meta update <TK3_ID> _ca_checked_in_at "2025-02-07T11:00:00-05:00"
wp post meta update <TK3_ID> _ca_diagnosing_at "2025-02-07T13:00:00-05:00"
wp post meta update <TK3_ID> _ca_in_progress_at "2025-02-08T09:00:00-05:00"
wp post meta update <TK3_ID> _ca_validation_at "2025-02-09T14:00:00-05:00"
wp post meta update <TK3_ID> _ca_ready_at "2025-02-09T16:00:00-05:00"

wp post create --post_type=ca_ticket --post_title="CA-20250208-004 — Mark Thompson" --post_status=publish
wp post meta update <TK4_ID> _ca_public_token "tk_Bw5rC8hFx1MnUaVd3Ks"
wp post meta update <TK4_ID> _ca_job_number "CA-20250208-004"
wp post meta update <TK4_ID> _ca_customer_id <MARK_ID>
wp post meta update <TK4_ID> _ca_device_id <SURFACE_ID>
wp post meta update <TK4_ID> _ca_status "DIAGNOSING"
wp post meta update <TK4_ID> _ca_intake_notes "Touchscreen unresponsive in certain areas. Possible digitizer issue."
wp post meta update <TK4_ID> _ca_checked_in_at "2025-02-08T09:00:00-05:00"
wp post meta update <TK4_ID> _ca_diagnosing_at "2025-02-08T10:30:00-05:00"

*/

-- ============================================================
-- OPTION 2: Raw SQL (Advanced)
-- ============================================================
-- Replace 'wp_' with your actual table prefix if different.
-- These are INSERT statements for reference. The WP-CLI
-- approach above is strongly preferred.

-- This file is intentionally left as WP-CLI commands above.
-- Raw SQL for WordPress custom post types is fragile due to
-- auto-increment IDs and meta relationships.
-- Use WP-CLI or the WordPress admin UI to seed data.
