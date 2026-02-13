import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDate(dateString: string): string {
  const d = new Date(dateString);
  const month = MONTHS[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
}

export function formatShortDate(dateString: string): string {
  const d = new Date(dateString);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function isOverdue(checkedInAt: string, thresholdHours: number = 48): boolean {
  const checkedIn = new Date(checkedInAt).getTime();
  const now = Date.now();
  return now - checkedIn > thresholdHours * 60 * 60 * 1000;
}
