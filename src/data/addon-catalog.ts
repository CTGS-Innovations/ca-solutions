import { AddOnCatalogItem } from "@/types";

export const addonCatalog: AddOnCatalogItem[] = [
  {
    id: "addon-001",
    name: "Data Backup Setup",
    description:
      "Full backup of your files to an external drive or cloud service before any work begins.",
    whyItMatters:
      "Protects your photos, documents, and important files in case of unexpected drive failure during repair.",
    price: 49,
    active: true,
  },
  {
    id: "addon-002",
    name: "Performance Tune-Up",
    description:
      "Startup optimization, removal of bloatware, disk cleanup, and system settings tuning for faster performance.",
    whyItMatters:
      "Most computers slow down over time from accumulated software. A tune-up restores near-original speed.",
    price: 79,
    active: true,
  },
  {
    id: "addon-003",
    name: "Security Hardening",
    description:
      "Antivirus verification, firewall configuration, browser security settings, and removal of potentially unwanted programs.",
    whyItMatters:
      "Prevents future malware infections and protects your personal information from common threats.",
    price: 59,
    active: true,
  },
  {
    id: "addon-004",
    name: "Long-Term Monitoring Setup",
    description:
      "Installation of lightweight monitoring tools that alert us if your system develops issues after repair.",
    whyItMatters:
      "Catches problems early before they become serious, reducing future repair costs and downtime.",
    price: 39,
    active: true,
  },
  {
    id: "addon-005",
    name: "Upgrade Evaluation",
    description:
      "Assessment of RAM, storage, and component upgrade options with a written recommendation and quote.",
    whyItMatters:
      "Know exactly what upgrades will give you the biggest performance improvement for your budget.",
    price: 0,
    active: true,
  },
];
