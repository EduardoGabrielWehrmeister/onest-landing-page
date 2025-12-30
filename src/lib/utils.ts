import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const EXPERIENCE_START_DATE = new Date("2024-08-01T00:00:00Z");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getExperienceYears(referenceDate = new Date()) {
  let years = referenceDate.getFullYear() - EXPERIENCE_START_DATE.getFullYear();

  const hasAnniversaryPassed =
    referenceDate.getMonth() > EXPERIENCE_START_DATE.getMonth() ||
    (referenceDate.getMonth() === EXPERIENCE_START_DATE.getMonth() &&
      referenceDate.getDate() >= EXPERIENCE_START_DATE.getDate());

  if (!hasAnniversaryPassed) {
    years -= 1;
  }

  return Math.max(1, years);
}
