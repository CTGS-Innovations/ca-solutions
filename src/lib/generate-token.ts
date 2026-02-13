import { nanoid } from "nanoid";

export function generateToken(): string {
  return nanoid(21);
}

export function generateJobNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `CA-${date}-${seq}`;
}
