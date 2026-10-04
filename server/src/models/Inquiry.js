import mongoose from 'mongoose';
import { SERVICE_OPTIONS, CONTACT_METHODS } from '../../../shared/contactSchema.js';

/**
 * Anonymous inquiry metadata — NO names, emails, phone numbers or messages.
 * Lets the practice count inquiries by service without storing personal data.
 * Records expire automatically after 180 days.
 */
const inquirySchema = new mongoose.Schema(
  {
    service: { type: String, enum: SERVICE_OPTIONS.map((s) => s.value), required: true },
    preferredContact: { type: String, enum: [...CONTACT_METHODS.map((m) => m.value), ''], default: '' },
    emailStatus: { type: String, enum: ['sent', 'failed'], required: true },
    confirmationSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 180 },
  },
  { versionKey: false }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
