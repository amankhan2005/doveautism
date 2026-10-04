import { useMemo, useState } from 'react';

/**
 * Field state shared by the site's forms: values, touched-based live validation
 * and a completeness check for enabling Submit. Rules come from the shared schemas,
 * so the browser and the API always agree.
 *
 * `linked` re-validates dependent fields, e.g. { preferredContact: ['phone'] }.
 */
export function useForm({ initial, normalize, validateField, fields, linked = {} }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function update(field, value) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Re-check live once a field has been visited or already shows an error.
    if (touched[field] || errors[field]) {
      const normalized = normalize(next);
      setErrors((prev) => {
        const out = { ...prev, [field]: validateField(field, normalized) };
        for (const dep of linked[field] || []) out[dep] = validateField(dep, normalized);
        return out;
      });
    }
  }

  function blur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, normalize(values)) }));
  }

  const bind = (field) => ({
    name: field,
    value: values[field],
    onChange: (e) => update(field, e.target.value),
    onBlur: () => blur(field),
  });

  const isComplete = useMemo(() => {
    const data = normalize(values);
    return fields.every((f) => !validateField(f, data));
  }, [values, normalize, validateField, fields]);

  /** Show a full set of errors (after a submit attempt or a server response). */
  function showErrors(next) {
    setErrors(next);
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
  }

  function reset(next = initial) {
    setValues(next);
    setErrors({});
    setTouched({});
  }

  return { values, errors, touched, update, blur, bind, isComplete, showErrors, reset };
}
