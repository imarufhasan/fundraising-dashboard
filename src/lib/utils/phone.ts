// Backend regex (keep in sync with server):
// /^(?:\+?1[\s.-]?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})[\s.-]?[2-9]\d{2}[\s.-]?\d{4}$/
export const usaPhoneRegex =
  /^(?:\+?1[\s.-]?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})[\s.-]?[2-9]\d{2}[\s.-]?\d{4}$/;

/**
 * Strips everything except digits, and drops a leading "1"
 * (country code) if present, so we always work with a clean
 * 10-digit national number internally.
 */
function getDigitsOnly(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }

  return digits;
}

/**
 * Formats raw input into "(XXX) XXX-XXXX" as the user types.
 * Used for the input field's onChange.
 */
export function formatUSPhone(value: string): string {
  const digits = getDigitsOnly(value).slice(0, 10);

  const len = digits.length;

  if (len === 0) return "";

  if (len < 4) {
    return `(${digits}`;
  }

  if (len < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function isValidUSPhone(value: string): boolean {
  const digits = getDigitsOnly(value);

  if (digits.length !== 10) return false;

  const formatted = `(${digits.slice(0, 3)}) ${digits.slice(
    3,
    6
  )}-${digits.slice(6)}`;

  return usaPhoneRegex.test(formatted);
}


export function getUSPhoneNumber(value: string): string {
  const digits = getDigitsOnly(value);

  return `+1${digits}`;
}