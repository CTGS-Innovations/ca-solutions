import { FAQ, ServiceItem } from "@/types";

export const heroContent = {
  headline: "Computer Repair You Can Actually See",
  subheadline:
    "Drop off. Scan your QR code. Track every step. Pick up with confidence.",
  ctaPrimary: "Check Repair Status",
  ctaSecondary: "Our Process",
};

export const services: ServiceItem[] = [
  {
    title: "Virus & Malware Removal",
    description:
      "Thorough cleaning using professional tools — not just a quick scan. We find and remove rootkits, trojans, and persistent threats.",
    icon: "Shield",
  },
  {
    title: "Hardware Diagnostics & Repair",
    description:
      "From failing hard drives to broken screens, we diagnose the actual cause and repair it with quality parts.",
    icon: "Cpu",
  },
  {
    title: "Data Recovery & Backup",
    description:
      "Lost files, corrupted drives, accidental deletion — we use specialized tools to recover what matters most to you.",
    icon: "HardDrive",
  },
  {
    title: "Performance Optimization",
    description:
      "Slow computer? We identify bottlenecks, remove bloatware, optimize startup, and get you back to full speed.",
    icon: "Zap",
  },
  {
    title: "Operating System Issues",
    description:
      "Blue screens, boot failures, update problems, and corruption — we restore your system to stable working order.",
    icon: "Monitor",
  },
  {
    title: "Network & Connectivity",
    description:
      "WiFi problems, printer issues, email configuration, and home/office network setup and troubleshooting.",
    icon: "Wifi",
  },
];

export const trustIndicators = [
  { stat: "500+", label: "Devices Repaired" },
  { stat: "4.9", label: "Google Rating" },
  { stat: "24hr", label: "Avg. Turnaround" },
  { stat: "100%", label: "Transparency" },
];

export const faqs: FAQ[] = [
  {
    question: "How long does a typical repair take?",
    answer:
      "Most repairs are completed within 24-48 hours. Complex issues like data recovery or motherboard repair may take longer. Your status page will always show the current stage so you never have to wonder.",
  },
  {
    question: "How do I check the status of my repair?",
    answer:
      "When you drop off your device, you'll receive a QR code. Scan it anytime to see your real-time repair status, including what stage your device is at and what's been done so far.",
  },
  {
    question: "Do I need an appointment?",
    answer:
      "No appointment needed. Walk-ins are welcome during business hours. For business clients, we also offer scheduled pickups and on-site service.",
  },
  {
    question: "What if you find additional issues during repair?",
    answer:
      "We'll update your status page and notify you before doing any additional work. You're always in control of what gets repaired and what gets deferred.",
  },
  {
    question: "Are the 'safeguards' required?",
    answer:
      "Absolutely not. Every repair includes our full baseline service — diagnostics, repair, and testing. Safeguards are optional enhancements that some customers find valuable for extra protection, but they're never required.",
  },
  {
    question: "What forms of payment do you accept?",
    answer:
      "We accept cash, all major credit and debit cards, Apple Pay, Google Pay, and Venmo. Business accounts can be invoiced with NET-15 terms.",
  },
  {
    question: "Do you offer a warranty on repairs?",
    answer:
      "Yes. All repairs come with a 30-day warranty. If the same issue recurs within 30 days, we'll fix it at no additional charge.",
  },
  {
    question: "Is my data safe during repair?",
    answer:
      "We take data privacy seriously. Your files are never accessed beyond what's needed for the repair. For added safety, we recommend our Data Backup Setup safeguard before any work begins.",
  },
];

export const businessServices = [
  {
    title: "Priority Service",
    description: "Business clients get priority queue placement and expedited turnaround times.",
  },
  {
    title: "Fleet Management",
    description: "Multi-device intake, tracking, and reporting for businesses with multiple machines.",
  },
  {
    title: "On-Site Support",
    description: "We come to your office for issues that can't wait or don't require bench time.",
  },
  {
    title: "Scheduled Maintenance",
    description: "Preventive maintenance plans to catch issues before they cause downtime.",
  },
  {
    title: "Invoice & NET Terms",
    description: "Flexible invoicing with NET-15 and NET-30 options for established accounts.",
  },
  {
    title: "Dedicated Account Manager",
    description: "A single point of contact who knows your environment and history.",
  },
];

export const contactInfo = {
  hours: [
    { day: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
    { day: "Saturday", time: "10:00 AM - 4:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  address: "123 Main Street, Suite 100, Anytown, ST 12345",
  phone: "(555) 123-4567",
  email: "hello@computerally.com",
  paymentMethods: [
    "Cash",
    "Visa / Mastercard / Amex",
    "Apple Pay",
    "Google Pay",
    "Venmo",
    "Business Invoice (NET-15)",
  ],
};
