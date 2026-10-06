/**
 * Privacy Policy page content — client-supplied text. Reproduce it word for
 * word; do not edit wording (including the "Care Plus Autism" / "Dove Autism"
 * names) without written client approval.
 *
 * `intro`    — paragraphs shown before the numbered sections.
 * `sections` — array of { heading, blocks[] }. Each block is either a
 *              paragraph string or { list: string[] } for a bulleted list.
 * `closing`  — paragraphs shown after the last section. A paragraph may be an
 *              array of strings and { text, href } links.
 */
export const PRIVACY = {
  title: 'Privacy Policy for Mobile Information and Text Messaging Consent',
  intro: [
    "At Care Plus Autism, we are committed to protecting the privacy and confidentiality of our customers' personal information. This privacy policy outlines how we handle mobile information and text messaging consent data, ensuring that your personal details are secure and used appropriately.",
  ],
  sections: [
    {
      heading: '1. No Sharing of Mobile Information with Third Parties',
      blocks: [
        'We want to assure you that any mobile information you provide, including phone numbers, will never be shared with third parties or affiliates for marketing or promotional purposes. Your mobile information is strictly used to improve the services we provide directly to you, such as scheduling updates, reminders, and customer support.',
        'No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All other categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.',
      ],
    },
    {
      heading: '2. Exclusion of Text Messaging Originator Opt-in Data and Consent',
      blocks: [
        'When you opt-in to receive text messages from us, you are granting consent for us to communicate with you via SMS for the specific purposes outlined, such as providing service updates, event scheduling, or reminders.',
        'This opt-in data and consent will not be shared with any third parties, including affiliates or partners, under any circumstances. This ensures that your consent to receive text messages remains private and is only utilized by Dove Autism to enhance your experience with our services.',
      ],
    },
    {
      heading: '3. Data Security',
      blocks: [
        'We take all necessary steps to protect your mobile information and consent data from unauthorized access, misuse, or disclosure. Our systems are designed with stringent security measures to ensure that your information remains confidential and secure.',
      ],
    },
    {
      heading: '4. Limited Use of Mobile Information',
      blocks: [
        'Your mobile information will only be used for purposes that you have explicitly consented to. These purposes include, but are not limited to:',
        { list: ['Event scheduling', 'Service reminders', 'Customer notifications', 'Other operational updates'] },
        'At no point will your mobile information be used for any marketing or promotional campaigns without your direct and explicit consent.',
      ],
    },
    {
      heading: '5. Reviewing and Updating Your Consent',
      blocks: [
        'You have the right to withdraw or update your consent for receiving text messages at any time. If you wish to opt-out of receiving SMS communications or update your preferences, you can do so by contacting our customer service team.',
      ],
    },
    {
      heading: '6. Changes to This Privacy Policy',
      blocks: [
        'Any updates to this privacy policy will be communicated to you promptly. We recommend reviewing this policy periodically to stay informed of any changes regarding how we handle your mobile information and consent data.',
      ],
    },
  ],
  closing: [
    [
      'If you have any questions or concerns about this privacy policy, please feel free to contact us at ',
      { text: 'info@doveautism.com', href: 'mailto:info@doveautism.com' },
      ' or ',
      { text: '+1 (410) 405-7050', href: 'tel:+14104057050' },
      '.',
    ],
    'By interacting with our services and providing your mobile information, you agree to the terms outlined in this privacy policy. Your trust in how we manage your data is important to us, and we remain committed to safeguarding your privacy at every step.',
  ],
};
