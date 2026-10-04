/**
 * Careers application schema — shared by the React client and the Express API.
 *
 * Deliberately basic: name, contact details, state and role only.
 * No resume, cover letter, date of birth, SSN or health information is collected.
 */
import { EMAIL_RE, PHONE_RE, singleLine } from './contactSchema.js';

export const ROLE_OPTIONS = [
  { value: 'RBT', label: 'RBT', title: 'Registered Behavior Technician' },
  { value: 'BT', label: 'BT', title: 'Behavior Technician' },
  { value: 'BCBA', label: 'BCBA', title: 'Board Certified Behavior Analyst' },
];

export const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'],
  ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'],
  ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'],
  ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'],
  ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'],
  ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
].map(([value, label]) => ({ value, label }));

export const APPLICATION_LIMITS = Object.freeze({ nameMax: 50, emailMax: 254, phoneMin: 7, phoneMax: 20 });

export const APPLICATION_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'state', 'role'];

export const roleTitle = (value) => {
  const r = ROLE_OPTIONS.find((o) => o.value === value);
  return r ? `${r.label} (${r.title})` : '';
};
export const stateName = (value) => US_STATES.find((s) => s.value === value)?.label ?? '';

/** Coerce untrusted input into the expected shape. Unknown keys are dropped. */
export function normalizeApplication(input = {}) {
  const src = input && typeof input === 'object' ? input : {};
  const startedAt = Number(src.startedAt);
  return {
    firstName: singleLine(src.firstName),
    lastName: singleLine(src.lastName),
    email: singleLine(src.email).toLowerCase(),
    phone: singleLine(src.phone),
    state: singleLine(src.state).toUpperCase(),
    role: singleLine(src.role).toUpperCase(),
    // Honeypot: a hidden field real visitors never see or fill.
    website: singleLine(src.website),
    startedAt: Number.isFinite(startedAt) ? startedAt : 0,
  };
}

/** Validate one normalized field. Returns an error message or ''. */
export function validateApplicationField(field, data) {
  const v = data[field];
  switch (field) {
    case 'firstName':
    case 'lastName': {
      const which = field === 'firstName' ? 'first' : 'last';
      if (!v) return `Enter your ${which} name.`;
      if (v.length > APPLICATION_LIMITS.nameMax) return `Keep your ${which} name under ${APPLICATION_LIMITS.nameMax} characters.`;
      if (/[<>]/.test(v)) return `Remove the < and > characters from your ${which} name.`;
      return '';
    }
    case 'email':
      if (!v) return 'Enter your email address.';
      if (v.length > APPLICATION_LIMITS.emailMax || !EMAIL_RE.test(v)) return 'Enter an email address in the format name@example.com.';
      return '';
    case 'phone': {
      if (!v) return 'Enter your phone number.';
      const digits = v.replace(/\D/g, '');
      if (!PHONE_RE.test(v) || digits.length < APPLICATION_LIMITS.phoneMin || v.length > APPLICATION_LIMITS.phoneMax)
        return 'Enter a phone number using digits, spaces, or + ( ) - characters.';
      return '';
    }
    case 'state':
      if (!v) return 'Choose the state you live in.';
      if (!US_STATES.some((s) => s.value === v)) return 'Choose one of the listed states.';
      return '';
    case 'role':
      if (!v) return 'Choose the position you are applying for.';
      if (!ROLE_OPTIONS.some((r) => r.value === v)) return 'Choose RBT, BT or BCBA.';
      return '';
    default:
      return '';
  }
}

export function validateApplication(data) {
  const errors = {};
  for (const field of APPLICATION_FIELDS) {
    const message = validateApplicationField(field, data);
    if (message) errors[field] = message;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
