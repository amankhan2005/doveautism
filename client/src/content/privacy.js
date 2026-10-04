/**
 * Privacy page content.
 *
 * `policy` — Dove Autism's full privacy policy (CLIENT TO SUPPLY before launch).
 *            Array of { heading, paragraphs[] }. Rendered above the website notes.
 * `websiteNotes` — factual description of how THIS website's contact form works,
 *            written to match the implementation in /server. Update it if the
 *            implementation changes.
 */
export const PRIVACY = {
  lastUpdated: null, // CLIENT TO SUPPLY, e.g. '2026-10-15'
  policy: [],
  websiteNotes: [
    {
      question: 'What the contact form collects',
      answer:
        'Your name, email address, optional phone number, preferred contact method, the service you are asking about, your message, and your consent to be contacted.',
    },
    {
      question: 'How your message is delivered',
      answer:
        'When you send the form, our server checks it and delivers it by email to the Dove Autism team through a third-party email delivery service. If you provided an email address, you also receive a confirmation email.',
    },
    {
      question: 'What this website stores',
      answer:
        'The website does not save your name, contact details or message in a database. Your message exists in the email sent to our team.',
    },
    {
      question: 'Health information',
      answer:
        'Please do not include medical records, diagnosis details or other sensitive health information in the form. Our team will discuss anything sensitive with you directly.',
    },
    {
      question: 'Cookies and tracking',
      answer:
        'This website does not use advertising or analytics cookies, and its fonts and images are served from our own domain.',
    },
  ],
};
