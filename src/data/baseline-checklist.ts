import { ChecklistItem } from "@/types";

export const baselineChecklistTemplate: Omit<ChecklistItem, "checked">[] = [
  { id: "chk-01", label: "Document device condition at intake" },
  { id: "chk-02", label: "Verify reported symptoms" },
  { id: "chk-03", label: "Run hardware diagnostics" },
  { id: "chk-04", label: "Check for malware and security threats" },
  { id: "chk-05", label: "Inspect hard drive health" },
  { id: "chk-06", label: "Check operating system integrity" },
  { id: "chk-07", label: "Verify all drivers are up to date" },
  { id: "chk-08", label: "Test network connectivity" },
  { id: "chk-09", label: "Clean temporary files and caches" },
  { id: "chk-10", label: "Verify repair resolves reported issue" },
  { id: "chk-11", label: "Run stability tests post-repair" },
  { id: "chk-12", label: "Document work completed and findings" },
];

export function createChecklist(): ChecklistItem[] {
  return baselineChecklistTemplate.map((item) => ({
    ...item,
    checked: false,
  }));
}
