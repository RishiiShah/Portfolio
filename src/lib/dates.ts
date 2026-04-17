const MONTH_TO_NUM: Record<string, string> = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};

/** Converts "January 2025" to "2025-01", or a bare "2025" to "2025". */
export function toIsoDate(human: string): string {
  const monthYear = human.match(/^(\w+)\s+(\d{4})$/);
  if (monthYear) {
    const m = MONTH_TO_NUM[monthYear[1].toLowerCase()];
    if (m) return `${monthYear[2]}-${m}`;
  }
  const year = human.match(/^(\d{4})$/);
  if (year) return year[1];
  return human;
}
