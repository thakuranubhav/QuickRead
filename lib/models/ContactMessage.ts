import { Schema, model, models } from "mongoose";

export type ContactMessageDocument = {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};

const ContactMessageSchema = new Schema<ContactMessageDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const ContactMessage =
  models.ContactMessage || model<ContactMessageDocument>("ContactMessage", ContactMessageSchema);
