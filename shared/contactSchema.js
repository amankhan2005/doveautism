/**
 * Contact / intake form schema — shared by the React client and the Express API
 * so validation rules can never drift apart.
 *
 * Fields are intentionally limited to what a first conversation needs.
 * Clinical or identifying child information (name, age, diagnosis, insurance)
 * is NOT collected until Dove Autism confirms it is required and a
 * health-privacy review has been completed.
 */

export const SERVICE_OPTIONS = [
  { value: 'early-intervention', label: 'Early intervention' },
  { value: 'in-home-aba', label: 'In-home ABA' },
  { value: 'school-readiness', label: 'School readiness' },
  { value: 'family-support', label: 'Family training & coordinated care' },
  { value: 'not-sure', label: "I'm not sure yet" },
];

export const CONTACT_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
];

export const LIMITS = Object.freeze({
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  phoneMin: 7,
  phoneMax: 20,
  messageMin: 10,
  messageMax: 2000,
});

/** Submissions completed faster than this are treated as automated. */
export const MIN_FILL_MS = 3000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+()\-.\s]+$/;
// Control characters except tab (\x09), newline (\x0A) and carriage return (\x0D).
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function toText(value) {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_RE, '');
}

function singleLine(value) {
  return toText(value).replace(/\s+/g, ' ').trim();
}

function multiLine(value) {
  return toText(value)
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function labelFor(options, value) {
  return options.find((o) => o.value === value)?.label ?? '';
}

/** Coerce untrusted input into the expected shape. Unknown keys are dropped. */
export function normalizeContact(input = {}) {
  const src = input && typeof input === 'object' ? input : {};
  const startedAt = Number(src.startedAt);
  return {
    name: singleLine(src.name),
    email: singleLine(src.email).toLowerCase(),
    phone: singleLine(src.phone),
    preferredContact: singleLine(src.preferredContact),
    service: singleLine(src.service),
    message: multiLine(src.message),
    consent: src.consent === true || src.consent === 'true' || src.consent === 'on',
    // Honeypot: a hidden field real visitors never see or fill.
    website: singleLine(src.website),
    startedAt: Number.isFinite(startedAt) ? startedAt : 0,
  };
}

/**
 * Validate one normalized field. Returns an error message or ''.
 * Messages say what to do, in the interface's voice.
 */
export function validateField(field, data) {
  const v = data[field];
  switch (field) {
    case 'name':
      if (!v) return 'Enter your name.';
      if (v.length < LIMITS.nameMin) return 'Enter at least 2 characters for your name.';
      if (v.length > LIMITS.nameMax) return `Keep your name under ${LIMITS.nameMax} characters.`;
      return '';
    case 'email':
      if (!v) return 'Enter your email address.';
      if (v.length > LIMITS.emailMax || !EMAIL_RE.test(v))
        return 'Enter an email address in the format name@example.com.';
      return '';
    case 'phone': {
      if (!v) {
        return data.preferredContact === 'phone'
          ? 'Add a phone number so we can call you, or choose email as your preferred contact method.'
          : '';
      }
      const digits = v.replace(/\D/g, '');
      if (!PHONE_RE.test(v) || digits.length < LIMITS.phoneMin || v.length > LIMITS.phoneMax)
        return 'Enter a phone number using digits, spaces, or + ( ) - characters.';
      return '';
    }
    case 'preferredContact':
      if (v && !CONTACT_METHODS.some((m) => m.value === v)) return 'Choose email or phone.';
      return '';
    case 'service':
      if (!v) return 'Choose the service you are asking about.';
      if (!SERVICE_OPTIONS.some((s) => s.value === v)) return 'Choose one of the listed services.';
      return '';
    case 'message':
      if (!v) return 'Tell us a little about how we can help.';
      if (v.length < LIMITS.messageMin) return `Add a little more detail — at least ${LIMITS.messageMin} characters.`;
      if (v.length > LIMITS.messageMax)
        return `Shorten your message to ${LIMITS.messageMax.toLocaleString('en-US')} characters or fewer.`;
      return '';
    case 'consent':
      if (!v) return 'Confirm that Dove Autism may contact you about your inquiry.';
      return '';
    default:
      return '';
  }
}

export const VALIDATED_FIELDS = ['name', 'email', 'phone', 'preferredContact', 'service', 'message', 'consent'];

/** Validate every field. Returns { valid, errors } where errors maps field → message. */
export function validateContact(data) {
  const errors = {};
  for (const field of VALIDATED_FIELDS) {
    const message = validateField(field, data);
    if (message) errors[field] = message;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
