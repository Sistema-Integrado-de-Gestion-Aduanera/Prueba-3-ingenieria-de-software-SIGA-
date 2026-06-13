/**
 * RFC 5322 compliant email regex.
 * Validates local-part@domain structure including subdomains and TLDs.
 */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Password: min 8 chars, at least one uppercase, one lowercase, one digit, one special char.
 */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,}$/;

/**
 * Sanitizes a RUT string: removes dots and hyphen, keeps only digits and trailing K/k.
 * Returns the cleaned string (body without check digit formatting).
 */
export function sanitizeRut(value: string): string {
  // Allow only digits and 'k'/'K' at any position during typing; strip everything else
  return value.replace(/[^0-9kK]/g, "").slice(0, 10);
}

/**
 * Validates a sanitized RUT string (digits only, 9-10 chars).
 * Does NOT include the Módulo 11 check digit algorithm — extend if needed.
 */
export function validateRut(value: string): string | null {
  const cleaned = sanitizeRut(value);
  if (cleaned.length === 0) return "Campo requerido";
  if (cleaned.length < 9) return "RUT muy corto (mínimo 9 dígitos)";
  if (cleaned.length > 10) return "RUT muy largo (máximo 10 dígitos)";
  return null;
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) return "Campo requerido";
  if (!EMAIL_REGEX.test(value)) return "Correo electrónico inválido";
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Campo requerido";
  if (!PASSWORD_REGEX.test(value))
    return "Mínimo 8 caracteres: mayúscula, minúscula, número y símbolo especial";
  return null;
}

export function validateName(value: string): string | null {
  if (!value || value.trim().length === 0) return "Campo requerido";
  return null;
}

/**
 * Validates a price value as double-precision float strictly greater than 0.00.
 */
export function validatePrice(value: string | number): string | null {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "Ingrese un valor numérico válido";
  if (num <= 0) return "El valor debe ser mayor a 0.00";
  return null;
}
