#!/usr/bin/env bash
#
# wp-manage.sh — Management script for Computer Ally WordPress stack
#
# Usage: ./wp-manage.sh {setup|start|stop|restart|status|logs|clean|reset|wp|shell|pma|help}
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="ca-wp"
WP_PORT=20200
PMA_PORT=20300
WP_URL="http://localhost:${WP_PORT}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

info()    { echo -e "${GREEN} ✓${NC} $*"; }
warn()    { echo -e "${YELLOW} !${NC} $*"; }
error()   { echo -e "${RED} ✗${NC} $*"; }
step()    { echo -e "\n${BOLD}${BLUE}[$1/$2]${NC} ${BOLD}$3${NC}"; }
heading() { echo -e "\n${BOLD}${BLUE}━━━ $* ━━━${NC}\n"; }
divider() { echo -e "${DIM}────────────────────────────────────────────${NC}"; }

compose() {
    docker compose -f "$SCRIPT_DIR/docker-compose.yml" -p "$PROJECT_NAME" "$@"
}

wpcli() {
    compose run --rm wpcli "$@"
}

# ─── Wait for WordPress to respond ──────────────────────

wait_for_wp() {
    local max_wait=90
    local elapsed=0
    echo -n "   Waiting for WordPress "
    while [[ $elapsed -lt $max_wait ]]; do
        if curl -s -o /dev/null -w "%{http_code}" "${WP_URL}" 2>/dev/null | grep -qE "200|302|301"; then
            echo -e " ${GREEN}ready${NC}"
            return 0
        fi
        echo -n "."
        sleep 2
        elapsed=$((elapsed + 2))
    done
    echo -e " ${RED}timeout${NC}"
    return 1
}

# Wait for WP-CLI to be able to connect (DB + WP files both ready)
wait_for_cli() {
    local max_wait=60
    local elapsed=0
    echo -n "   Waiting for database "
    while [[ $elapsed -lt $max_wait ]]; do
        if wpcli db check &>/dev/null; then
            echo -e " ${GREEN}ready${NC}"
            return 0
        fi
        echo -n "."
        sleep 3
        elapsed=$((elapsed + 3))
    done
    echo -e " ${RED}timeout${NC}"
    return 1
}

# ─── Helper: create page with content ───────────────────

create_page() {
    local title="$1"
    local slug="$2"
    local content="$3"

    # Check if page already exists
    local existing
    existing=$(wpcli post list --post_type=page --name="$slug" --field=ID 2>/dev/null || echo "")
    if [[ -n "$existing" ]]; then
        echo "   Page '$title' already exists (ID $existing), updating..."
        wpcli post update "$existing" --post_content="$content" --post_status=publish 2>/dev/null
        echo "$existing"
        return
    fi

    local id
    id=$(wpcli post create \
        --post_type=page \
        --post_title="$title" \
        --post_name="$slug" \
        --post_status=publish \
        --post_content="$content" \
        --porcelain 2>/dev/null)
    echo "$id"
}

# ═════════════════════════════════════════════════════════
#  SETUP — The super-setup. Does EVERYTHING.
# ═════════════════════════════════════════════════════════

cmd_setup() {
    local total_steps=11

    heading "Computer Ally — WordPress Full Setup"
    echo -e "  This will set up a complete WordPress site with:"
    echo -e "  Themes, plugins, pages, menus, content, and demo data.\n"

    # ── Step 1: Pull images and start containers ────────
    step 1 $total_steps "Pulling images & starting containers"

    compose pull --quiet 2>/dev/null || compose pull
    compose up -d
    wait_for_wp || {
        error "WordPress containers failed to start."
        error "Run: ./wp-manage.sh logs"
        exit 1
    }
    wait_for_cli || {
        error "Database connection failed."
        error "Run: ./wp-manage.sh logs db"
        exit 1
    }

    # ── Step 2: Install WordPress core ──────────────────
    step 2 $total_steps "Installing WordPress core"

    if wpcli core is-installed &>/dev/null; then
        info "WordPress already installed, skipping core install"
    else
        wpcli core install \
            --url="${WP_URL}" \
            --title="Computer Ally" \
            --admin_user=admin \
            --admin_password=admin \
            --admin_email="admin@computerally.com" \
            --skip-email
        info "WordPress core installed"
    fi

    # ── Step 3: Configure WordPress settings ────────────
    step 3 $total_steps "Configuring WordPress settings"

    wpcli option update blogname "Computer Ally"
    wpcli option update blogdescription "Computer Repair You Can Actually See"
    wpcli option update timezone_string "America/New_York"
    wpcli option update date_format "F j, Y"
    wpcli option update time_format "g:i A"
    wpcli option update blog_public 0
    wpcli option update default_comment_status "closed"
    wpcli option update default_ping_status "closed"
    wpcli option update permalink_structure "/%postname%/"
    info "Site settings configured"

    # ── Step 4: Install themes ──────────────────────────
    step 4 $total_steps "Installing themes"

    # Hello Elementor (parent theme — required)
    if wpcli theme is-installed hello-elementor &>/dev/null; then
        info "Hello Elementor already installed"
    else
        wpcli theme install hello-elementor
        info "Hello Elementor installed"
    fi

    # Activate the child theme (mounted via docker volume)
    wpcli theme activate computerally-child 2>/dev/null || {
        error "Child theme activation failed — check volume mount"
        exit 1
    }
    info "Computer Ally child theme activated"

    # Remove default themes to keep it clean
    for t in twentytwentyfive twentytwentyfour twentytwentythree twentytwentytwo twentytwentyone twentytwenty; do
        wpcli theme delete "$t" 2>/dev/null || true
    done
    info "Default themes removed"

    # ── Step 5: Install plugins ─────────────────────────
    step 5 $total_steps "Installing plugins"

    # Elementor (free — page builder)
    if wpcli plugin is-installed elementor &>/dev/null; then
        info "Elementor already installed"
    else
        wpcli plugin install elementor --activate
        info "Elementor installed & activated"
    fi
    wpcli plugin activate elementor 2>/dev/null || true

    # Computer Ally Core (mounted via volume)
    wpcli plugin activate computer-ally-core 2>/dev/null || {
        error "Computer Ally Core plugin activation failed — check volume mount"
        exit 1
    }
    info "Computer Ally Core plugin activated"

    # Classic Editor — useful as fallback for shortcode pages
    if ! wpcli plugin is-installed classic-editor &>/dev/null; then
        wpcli plugin install classic-editor --activate
        info "Classic Editor installed (shortcode pages)"
    else
        wpcli plugin activate classic-editor 2>/dev/null || true
        info "Classic Editor activated"
    fi

    # Remove default junk plugins
    wpcli plugin deactivate akismet 2>/dev/null || true
    wpcli plugin delete akismet 2>/dev/null || true
    wpcli plugin deactivate hello 2>/dev/null || true
    wpcli plugin delete hello 2>/dev/null || true
    info "Default plugins cleaned up"

    # ── Step 6: Create all pages with content ───────────
    step 6 $total_steps "Creating pages with content"

    # HOME
    local home_id
    home_id=$(create_page "Home" "home" "$(cat <<'CONTENT'
[ca_trust_stats]

<h2 style="text-align:center; margin: 3rem 0 1rem;">How It Works</h2>
<p style="text-align:center; color:#6B7280; margin-bottom:2rem;">Every repair follows the same thorough, transparent process.</p>
[ca_process_steps]

<h2 style="text-align:center; margin: 3rem 0 1rem;">What We Fix</h2>
<p style="text-align:center; color:#6B7280; margin-bottom:2rem;">Professional service for all major hardware and software issues.</p>
[ca_services_grid]

[ca_cta_banner title="Ready to Get Your Computer Fixed?" text="Drop off your device and track every step of the repair process." button_text="Contact Us" button_url="/contact"]
CONTENT
)")
    info "Home page (ID $home_id)"

    # SERVICES
    local services_id
    services_id=$(create_page "Services" "services" "$(cat <<'CONTENT'
<p style="color:#6B7280; margin-bottom:2rem;">Professional computer repair services for home and business.</p>

[ca_services_grid]

<div style="margin-top:2rem;">
<h2 style="text-align:center; margin-bottom:1rem;">Optional Safeguards</h2>
<p style="text-align:center; color:#6B7280; margin-bottom:2rem;">Add-on services to get more from your repair. None are required.</p>
[ca_safeguards]
</div>

[ca_cta_banner title="Need a Repair?" text="Walk-ins welcome. No appointment necessary." button_text="Contact Us" button_url="/contact"]
CONTENT
)")
    info "Services page (ID $services_id)"

    # OUR PROCESS
    local process_id
    process_id=$(create_page "Our Process" "process" "$(cat <<'CONTENT'
<p style="color:#6B7280; margin-bottom:2rem;">Every repair follows the same thorough, transparent process.</p>

[ca_process_steps]

<div style="margin-top:3rem;">
[ca_checklist]
</div>

[ca_cta_banner title="Ready to See the Difference?" text="Drop off your device and track every step." button_text="Get Started" button_url="/contact"]
CONTENT
)")
    info "Our Process page (ID $process_id)"

    # BUSINESS SERVICES
    local business_id
    business_id=$(create_page "Business Services" "business" "$(cat <<'CONTENT'
<p style="color:#6B7280; margin-bottom:2rem;">IT support designed for small and mid-size businesses. Priority service, fleet tracking, and flexible billing.</p>

<div class="ca-services-grid">
  <div class="ca-card"><div class="ca-card-body">
    <h3 class="ca-card-title">Priority Service</h3>
    <p class="ca-card-description">Business clients get priority queue placement and expedited turnaround times.</p>
  </div></div>
  <div class="ca-card"><div class="ca-card-body">
    <h3 class="ca-card-title">Fleet Management</h3>
    <p class="ca-card-description">Multi-device intake, tracking, and reporting for businesses with multiple machines.</p>
  </div></div>
  <div class="ca-card"><div class="ca-card-body">
    <h3 class="ca-card-title">On-Site Support</h3>
    <p class="ca-card-description">We come to your office for issues that can't wait or don't require bench time.</p>
  </div></div>
  <div class="ca-card"><div class="ca-card-body">
    <h3 class="ca-card-title">Scheduled Maintenance</h3>
    <p class="ca-card-description">Preventive maintenance plans to catch issues before they cause downtime.</p>
  </div></div>
  <div class="ca-card"><div class="ca-card-body">
    <h3 class="ca-card-title">Invoice &amp; NET Terms</h3>
    <p class="ca-card-description">Flexible invoicing with NET-15 and NET-30 options for established accounts.</p>
  </div></div>
  <div class="ca-card"><div class="ca-card-body">
    <h3 class="ca-card-title">Dedicated Account Manager</h3>
    <p class="ca-card-description">A single point of contact who knows your environment and history.</p>
  </div></div>
</div>

[ca_cta_banner title="Ready to Streamline Your IT?" text="Contact us about business pricing and priority service." button_text="Get in Touch" button_url="/contact"]
CONTENT
)")
    info "Business Services page (ID $business_id)"

    # FAQ
    local faq_id
    faq_id=$(create_page "FAQ" "faq" "$(cat <<'CONTENT'
<p style="color:#6B7280; margin-bottom:2rem;">Common questions about our repair process and services.</p>

[ca_faq]

[ca_cta_banner title="Still Have Questions?" text="We're happy to help." button_text="Contact Us" button_url="/contact"]
CONTENT
)")
    info "FAQ page (ID $faq_id)"

    # CONTACT
    local contact_id
    contact_id=$(create_page "Contact" "contact" "$(cat <<'CONTENT'
<p style="color:#6B7280; margin-bottom:2rem;">We're here to help with all your computer repair needs.</p>

[ca_contact_info]
CONTENT
)")
    info "Contact page (ID $contact_id)"

    # PRIVACY POLICY
    local privacy_id
    privacy_id=$(create_page "Privacy Policy" "privacy" "$(cat <<'CONTENT'
<p><strong>Effective Date:</strong> February 1, 2025</p>

<h3>Information We Collect</h3>
<p>When you bring a device in for repair, we collect your name, phone number, and email address for communication purposes. We also record your device details (make, model, serial number) and the reported issue to perform the repair.</p>

<h3>How We Use Your Information</h3>
<p>Your information is used solely to provide repair services, communicate repair status, and contact you when your device is ready. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>

<h3>Device Data</h3>
<p>During repair, we may need to access your device to diagnose and resolve issues. We access only what is necessary for the repair. We do not copy, retain, or browse personal files beyond what is required for the service.</p>

<h3>Status Page</h3>
<p>Your repair status page is accessible via a unique, hard-to-guess URL. It displays minimal information: device type, repair status, and service notes. No sensitive personal information is displayed on the public status page.</p>

<h3>Data Retention</h3>
<p>We retain repair records for 12 months after service completion for warranty and reference purposes. After this period, records are securely deleted.</p>

<h3>Contact</h3>
<p>For questions about this policy, contact us at hello@computerally.com or call (555) 123-4567.</p>
CONTENT
)")
    info "Privacy Policy page (ID $privacy_id)"

    # TERMS OF SERVICE
    local terms_id
    terms_id=$(create_page "Terms of Service" "terms" "$(cat <<'CONTENT'
<p><strong>Effective Date:</strong> February 1, 2025</p>

<h3>Service Agreement</h3>
<p>By leaving your device with Computer Ally for repair, you agree to these terms. We will diagnose the issue and provide a repair estimate before proceeding with any work that exceeds the standard diagnostic fee.</p>

<h3>Estimates &amp; Authorization</h3>
<p>Repair estimates are provided after diagnostics. We will not proceed with repairs exceeding the estimate without your explicit approval via phone, email, or the status page.</p>

<h3>Warranty</h3>
<p>All repairs include a 30-day warranty covering the specific issue repaired. If the same problem recurs within 30 days, we will re-repair at no additional cost. This warranty does not cover new issues, physical damage, or software changes made after pickup.</p>

<h3>Liability</h3>
<p>While we take every precaution to protect your device and data, Computer Ally is not liable for pre-existing data loss, hardware failures unrelated to our repair, or issues arising from undisclosed damage. We strongly recommend the Data Backup Setup safeguard for additional protection.</p>

<h3>Abandoned Devices</h3>
<p>Devices not picked up within 60 days of the "Ready for Pickup" notification will be considered abandoned. We will make three contact attempts before disposal.</p>

<h3>Payment</h3>
<p>Payment is due at pickup unless prior arrangements have been made for business accounts. We accept cash, credit/debit cards, Apple Pay, Google Pay, and Venmo.</p>
CONTENT
)")
    info "Terms of Service page (ID $terms_id)"

    # Repair Status page (auto-created by plugin, ensure it exists)
    local repair_id
    repair_id=$(wpcli post list --post_type=page --name=repair-status --field=ID 2>/dev/null || echo "")
    if [[ -z "$repair_id" ]]; then
        repair_id=$(create_page "Repair Status" "repair-status" "[ca_repair_status]")
    fi
    info "Repair Status page (ID $repair_id)"

    # ── Step 7: Configure homepage & reading settings ───
    step 7 $total_steps "Configuring homepage & reading settings"

    wpcli option update show_on_front page
    wpcli option update page_on_front "$home_id"
    info "Homepage set to 'Home' page"

    # ── Step 8: Create navigation menus ─────────────────
    step 8 $total_steps "Creating navigation menus"

    # Delete any existing menu with this name first
    wpcli menu delete "Primary" 2>/dev/null || true
    wpcli menu create "Primary"

    wpcli menu item add-post "Primary" "$services_id"  --title="Services"
    wpcli menu item add-post "Primary" "$process_id"   --title="Our Process"
    wpcli menu item add-post "Primary" "$business_id"  --title="Business"
    wpcli menu item add-post "Primary" "$faq_id"       --title="FAQ"
    wpcli menu item add-post "Primary" "$contact_id"   --title="Contact"

    wpcli menu location assign "Primary" primary 2>/dev/null || true
    info "Primary navigation menu created & assigned"

    # Footer menu
    wpcli menu delete "Footer" 2>/dev/null || true
    wpcli menu create "Footer"

    wpcli menu item add-post "Footer" "$services_id"  --title="Services"
    wpcli menu item add-post "Footer" "$faq_id"       --title="FAQ"
    wpcli menu item add-post "Footer" "$contact_id"   --title="Contact"
    wpcli menu item add-post "Footer" "$privacy_id"   --title="Privacy"
    wpcli menu item add-post "Footer" "$terms_id"     --title="Terms"

    wpcli menu location assign "Footer" footer 2>/dev/null || true
    info "Footer navigation menu created & assigned"

    # ── Step 9: Clean up default WordPress content ──────
    step 9 $total_steps "Cleaning up defaults"

    # Delete default posts and pages
    wpcli post delete 1 --force 2>/dev/null || true   # "Hello World"
    wpcli post delete 2 --force 2>/dev/null || true   # "Sample Page"
    wpcli post delete 3 --force 2>/dev/null || true   # "Privacy Policy" (WP default)

    # Delete default widgets
    wpcli widget reset --all 2>/dev/null || true

    # Disable comments globally
    wpcli option update default_comment_status closed
    wpcli option update default_ping_status closed

    info "Default content & widgets cleaned up"

    # ── Step 10: Seed demo data ─────────────────────────
    step 10 $total_steps "Seeding demo data (4 customers, 4 devices, 4 tickets)"

    seed_demo_data

    # ── Step 11: Flush & final checks ───────────────────
    step 11 $total_steps "Flushing rewrites & final checks"

    wpcli rewrite flush
    wpcli cache flush 2>/dev/null || true
    info "Rewrites flushed"

    # Verify everything
    local theme_active plugin_active page_count
    theme_active=$(wpcli theme list --status=active --field=name 2>/dev/null || echo "unknown")
    plugin_active=$(wpcli plugin list --status=active --field=name 2>/dev/null | wc -l)
    page_count=$(wpcli post list --post_type=page --post_status=publish --field=ID 2>/dev/null | wc -l)

    divider
    echo ""
    echo -e "  ${BOLD}${GREEN}Setup Complete!${NC}"
    echo ""
    echo -e "  ${BOLD}Active theme :${NC} ${CYAN}${theme_active}${NC}"
    echo -e "  ${BOLD}Plugins      :${NC} ${CYAN}${plugin_active} active${NC}"
    echo -e "  ${BOLD}Pages        :${NC} ${CYAN}${page_count} published${NC}"
    echo ""
    divider
    echo ""
    echo -e "  ${BOLD}WordPress${NC}     ${CYAN}${WP_URL}${NC}"
    echo -e "  ${BOLD}WP Admin${NC}      ${CYAN}${WP_URL}/wp-admin${NC}"
    echo -e "  ${BOLD}phpMyAdmin${NC}    ${CYAN}http://localhost:${PMA_PORT}${NC}"
    echo ""
    echo -e "  ${BOLD}Login${NC}         user: ${CYAN}admin${NC}  pass: ${CYAN}admin${NC}"
    echo ""
    divider
    echo ""
    echo -e "  ${BOLD}Demo repair pages:${NC}"
    echo -e "  ${CYAN}${WP_URL}/repair/tk_Nq3kR7xBm2PvLwYs9Hj${NC}  (Checked In)"
    echo -e "  ${CYAN}${WP_URL}/repair/tk_Xp8mT4nAw6QrKcDf5Uy${NC}  (Repair In Progress)"
    echo -e "  ${CYAN}${WP_URL}/repair/tk_Gy7vJ2sEn9WqZmPk4Lt${NC}  (Ready for Pickup)"
    echo -e "  ${CYAN}${WP_URL}/repair/tk_Bw5rC8hFx1MnUaVd3Ks${NC}  (Diagnosing — Overdue)"
    echo ""
    divider
    echo ""
    echo -e "  ${YELLOW}Elementor Pro:${NC} Install manually via WP Admin > Plugins"
    echo -e "  (Requires a license key from elementor.com)"
    echo -e "  After installing, use ${BOLD}elementor-templates/pages.md${NC} to build"
    echo -e "  the visual layouts with the Elementor editor."
    echo ""
}

# ═════════════════════════════════════════════════════════
#  SEED DEMO DATA — extracted so setup calls it
# ═════════════════════════════════════════════════════════

seed_demo_data() {
    # ── Customers ──
    local sarah_id james_id linda_id mark_id

    sarah_id=$(wpcli post create --post_type=ca_customer --post_title="Sarah Mitchell" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$sarah_id" _ca_phone "(555) 234-5678"
    wpcli post meta update "$sarah_id" _ca_email "sarah.mitchell@email.com"

    james_id=$(wpcli post create --post_type=ca_customer --post_title="James Rodriguez" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$james_id" _ca_phone "(555) 345-6789"
    wpcli post meta update "$james_id" _ca_email "james.rodriguez@email.com"

    linda_id=$(wpcli post create --post_type=ca_customer --post_title="Linda Chen" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$linda_id" _ca_phone "(555) 456-7890"
    wpcli post meta update "$linda_id" _ca_email "linda.chen@email.com"

    mark_id=$(wpcli post create --post_type=ca_customer --post_title="Mark Thompson" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$mark_id" _ca_phone "(555) 567-8901"
    wpcli post meta update "$mark_id" _ca_email "mark.thompson@email.com"

    info "4 customers created"

    # ── Devices ──
    local dell_id mac_id hp_id surface_id

    dell_id=$(wpcli post create --post_type=ca_device --post_title="Dell Latitude 5530" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$dell_id" _ca_make "Dell"
    wpcli post meta update "$dell_id" _ca_model "Latitude 5530"

    mac_id=$(wpcli post create --post_type=ca_device --post_title="MacBook Pro 14" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$mac_id" _ca_make "Apple"
    wpcli post meta update "$mac_id" _ca_model "MacBook Pro 14"

    hp_id=$(wpcli post create --post_type=ca_device --post_title="HP Pavilion Desktop" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$hp_id" _ca_make "HP"
    wpcli post meta update "$hp_id" _ca_model "Pavilion Desktop"

    surface_id=$(wpcli post create --post_type=ca_device --post_title="Surface Pro 9" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$surface_id" _ca_make "Microsoft"
    wpcli post meta update "$surface_id" _ca_model "Surface Pro 9"

    info "4 devices created"

    # ── Tickets ──

    # Ticket 1 — Checked In
    local tk1_id
    tk1_id=$(wpcli post create --post_type=ca_ticket --post_title="CA-20250210-001 — Sarah Mitchell" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$tk1_id" _ca_public_token "tk_Nq3kR7xBm2PvLwYs9Hj"
    wpcli post meta update "$tk1_id" _ca_job_number "CA-20250210-001"
    wpcli post meta update "$tk1_id" _ca_customer_id "$sarah_id"
    wpcli post meta update "$tk1_id" _ca_device_id "$dell_id"
    wpcli post meta update "$tk1_id" _ca_status "CHECKED_IN"
    wpcli post meta update "$tk1_id" _ca_intake_notes "Customer reports intermittent blue screens over the past week."
    wpcli post meta update "$tk1_id" _ca_checked_in_at "2025-02-10T10:30:00-05:00"

    # Ticket 2 — Repair In Progress
    local tk2_id
    tk2_id=$(wpcli post create --post_type=ca_ticket --post_title="CA-20250209-002 — James Rodriguez" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$tk2_id" _ca_public_token "tk_Xp8mT4nAw6QrKcDf5Uy"
    wpcli post meta update "$tk2_id" _ca_job_number "CA-20250209-002"
    wpcli post meta update "$tk2_id" _ca_customer_id "$james_id"
    wpcli post meta update "$tk2_id" _ca_device_id "$mac_id"
    wpcli post meta update "$tk2_id" _ca_status "REPAIR_IN_PROGRESS"
    wpcli post meta update "$tk2_id" _ca_intake_notes "Screen flickering and occasional kernel panic."
    wpcli post meta update "$tk2_id" _ca_checked_in_at "2025-02-09T14:00:00-05:00"
    wpcli post meta update "$tk2_id" _ca_diagnosing_at "2025-02-09T15:30:00-05:00"
    wpcli post meta update "$tk2_id" _ca_in_progress_at "2025-02-10T09:00:00-05:00"

    # Ticket 3 — Ready for Pickup
    local tk3_id
    tk3_id=$(wpcli post create --post_type=ca_ticket --post_title="CA-20250207-003 — Linda Chen" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$tk3_id" _ca_public_token "tk_Gy7vJ2sEn9WqZmPk4Lt"
    wpcli post meta update "$tk3_id" _ca_job_number "CA-20250207-003"
    wpcli post meta update "$tk3_id" _ca_customer_id "$linda_id"
    wpcli post meta update "$tk3_id" _ca_device_id "$hp_id"
    wpcli post meta update "$tk3_id" _ca_status "READY_FOR_PICKUP"
    wpcli post meta update "$tk3_id" _ca_intake_notes "Desktop won't boot. Power light comes on but no display."
    wpcli post meta update "$tk3_id" _ca_checked_in_at "2025-02-07T11:00:00-05:00"
    wpcli post meta update "$tk3_id" _ca_diagnosing_at "2025-02-07T13:00:00-05:00"
    wpcli post meta update "$tk3_id" _ca_in_progress_at "2025-02-08T09:00:00-05:00"
    wpcli post meta update "$tk3_id" _ca_validation_at "2025-02-09T14:00:00-05:00"
    wpcli post meta update "$tk3_id" _ca_ready_at "2025-02-09T16:00:00-05:00"

    # Ticket 4 — Diagnosing (overdue)
    local tk4_id
    tk4_id=$(wpcli post create --post_type=ca_ticket --post_title="CA-20250208-004 — Mark Thompson" --post_status=publish --porcelain 2>/dev/null)
    wpcli post meta update "$tk4_id" _ca_public_token "tk_Bw5rC8hFx1MnUaVd3Ks"
    wpcli post meta update "$tk4_id" _ca_job_number "CA-20250208-004"
    wpcli post meta update "$tk4_id" _ca_customer_id "$mark_id"
    wpcli post meta update "$tk4_id" _ca_device_id "$surface_id"
    wpcli post meta update "$tk4_id" _ca_status "DIAGNOSING"
    wpcli post meta update "$tk4_id" _ca_intake_notes "Touchscreen unresponsive in certain areas. Possible digitizer issue."
    wpcli post meta update "$tk4_id" _ca_checked_in_at "2025-02-08T09:00:00-05:00"
    wpcli post meta update "$tk4_id" _ca_diagnosing_at "2025-02-08T10:30:00-05:00"

    info "4 tickets created"
}

# ═════════════════════════════════════════════════════════
#  LIFECYCLE COMMANDS
# ═════════════════════════════════════════════════════════

cmd_start() {
    heading "Starting Computer Ally WordPress"
    compose up -d
    wait_for_wp || true
    echo ""
    cmd_status
}

cmd_stop() {
    heading "Stopping Computer Ally WordPress"
    compose down
    info "Stack stopped. Data preserved."
}

cmd_restart() {
    heading "Restarting Computer Ally WordPress"
    compose down
    compose up -d
    wait_for_wp || true
    echo ""
    cmd_status
}

cmd_status() {
    heading "Status"
    compose ps -a --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
    echo ""

    if curl -s -o /dev/null -w "" "${WP_URL}" 2>/dev/null; then
        info "WordPress  ${CYAN}${WP_URL}${NC}"
    else
        warn "WordPress  ${RED}not responding${NC}"
    fi

    if curl -s -o /dev/null -w "" "http://localhost:${PMA_PORT}" 2>/dev/null; then
        info "phpMyAdmin ${CYAN}http://localhost:${PMA_PORT}${NC}"
    else
        warn "phpMyAdmin ${RED}not responding${NC}"
    fi
    echo ""
}

cmd_logs() {
    local service="${2:-}"
    local follow=""

    # Check all remaining args for -f
    for arg in "${@:2}"; do
        if [[ "$arg" == "-f" || "$arg" == "--follow" ]]; then
            follow="-f"
        fi
    done

    if [[ -n "$service" && "$service" != "-f" && "$service" != "--follow" ]]; then
        compose logs $follow --tail=200 "$service"
    else
        compose logs $follow --tail=200
    fi
}

# ═════════════════════════════════════════════════════════
#  CLEAN — Nuke everything. Reset to zero.
# ═════════════════════════════════════════════════════════

cmd_clean() {
    echo ""
    echo -e "  ${RED}${BOLD}This will DESTROY everything:${NC}"
    echo -e "  - All containers (WordPress, DB, phpMyAdmin)"
    echo -e "  - All database data"
    echo -e "  - All WordPress uploads and settings"
    echo -e "  - All demo tickets, customers, devices"
    echo ""
    echo -e "  Your ${BOLD}theme and plugin source code${NC} is safe (lives in this repo)."
    echo ""
    echo -en "  ${YELLOW}Type 'clean' to confirm: ${NC}"
    read -r confirm
    if [[ "$confirm" == "clean" ]]; then
        heading "Cleaning everything..."
        compose down -v --remove-orphans 2>/dev/null || true

        # Also remove any dangling containers with our prefix
        docker rm -f ca-wp-db ca-wp-app ca-wp-pma ca-wp-cli 2>/dev/null || true

        # Remove named volumes explicitly in case compose missed them
        docker volume rm ca-wp-db-data ca-wp-data 2>/dev/null || true

        echo ""
        info "All containers and volumes removed."
        info "Run ${BOLD}./wp-manage.sh setup${NC} to start fresh."
        echo ""
    else
        info "Cancelled."
    fi
}

# ═════════════════════════════════════════════════════════
#  RESET — Clean + Setup in one shot
# ═════════════════════════════════════════════════════════

cmd_reset() {
    echo ""
    echo -e "  ${YELLOW}${BOLD}Reset = Clean + Setup${NC}"
    echo -e "  This will destroy all data and rebuild from scratch."
    echo ""
    echo -en "  ${YELLOW}Type 'reset' to confirm: ${NC}"
    read -r confirm
    if [[ "$confirm" == "reset" ]]; then
        heading "Cleaning..."
        compose down -v --remove-orphans 2>/dev/null || true
        docker rm -f ca-wp-db ca-wp-app ca-wp-pma ca-wp-cli 2>/dev/null || true
        docker volume rm ca-wp-db-data ca-wp-data 2>/dev/null || true
        info "Clean complete"

        cmd_setup
    else
        info "Cancelled."
    fi
}

# ═════════════════════════════════════════════════════════
#  UTILITY COMMANDS
# ═════════════════════════════════════════════════════════

cmd_wp() {
    shift
    wpcli "$@"
}

cmd_shell() {
    info "Opening bash shell in WordPress container..."
    docker exec -it ca-wp-app bash
}

cmd_pma() {
    echo ""
    echo -e "  ${BOLD}phpMyAdmin${NC}  ${CYAN}http://localhost:${PMA_PORT}${NC}"
    echo -e "  ${BOLD}Login${NC}       root / root_dev_2025"
    echo ""
}

# ═════════════════════════════════════════════════════════
#  HELP
# ═════════════════════════════════════════════════════════

cmd_help() {
    echo ""
    echo -e "${BOLD}Computer Ally WordPress — Stack Manager${NC}"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo -e "${BOLD}First Time:${NC}"
    echo "  setup       Full install — containers, WordPress, themes, plugins,"
    echo "              pages, menus, content, demo data. One command, done."
    echo ""
    echo -e "${BOLD}Daily Use:${NC}"
    echo "  start       Start the stack"
    echo "  stop        Stop the stack (data preserved)"
    echo "  restart     Stop + start"
    echo "  status      Container health checks and URLs"
    echo ""
    echo -e "${BOLD}Logs:${NC}"
    echo "  logs               All container logs (last 200 lines)"
    echo "  logs wordpress     WordPress/Apache logs"
    echo "  logs db            MariaDB logs"
    echo "  logs -f            Follow all logs"
    echo "  logs wordpress -f  Follow WordPress logs"
    echo ""
    echo -e "${BOLD}Teardown:${NC}"
    echo "  clean       Stop everything and DELETE all data (type 'clean' to confirm)"
    echo "  reset       Clean + setup in one shot (type 'reset' to confirm)"
    echo ""
    echo -e "${BOLD}Tools:${NC}"
    echo "  wp <args>   Run WP-CLI (e.g. $0 wp plugin list)"
    echo "  shell       Bash into the WordPress container"
    echo "  pma         Show phpMyAdmin URL & credentials"
    echo ""
    echo -e "${BOLD}URLs:${NC}"
    echo "  WordPress    http://localhost:${WP_PORT}"
    echo "  WP Admin     http://localhost:${WP_PORT}/wp-admin"
    echo "  phpMyAdmin   http://localhost:${PMA_PORT}"
    echo ""
    echo -e "${BOLD}Quick Start:${NC}"
    echo "  $0 setup     # First time — does everything"
    echo "  $0 start     # After that — just starts it up"
    echo "  $0 stop      # Shut down for the day"
    echo "  $0 reset     # Blow it away and start fresh"
    echo ""
}

# ─── Main ────────────────────────────────────────────────

case "${1:-help}" in
    setup)       cmd_setup ;;
    start)       cmd_start ;;
    stop)        cmd_stop ;;
    restart)     cmd_restart ;;
    status)      cmd_status ;;
    logs)        cmd_logs "$@" ;;
    clean)       cmd_clean ;;
    reset)       cmd_reset ;;
    wp)          cmd_wp "$@" ;;
    shell)       cmd_shell ;;
    pma)         cmd_pma ;;
    help|--help|-h)  cmd_help ;;
    *)
        error "Unknown command: $1"
        cmd_help
        exit 1
        ;;
esac
