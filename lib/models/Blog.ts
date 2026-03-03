import { Schema, model, models, type Model } from "mongoose";

export type BlogDocument = {
  title: string;
  slug: string;
  authorName: string;
  authorId?: string;
  category: string;
  imageUrl?: string;
  imageFilename?: string;
  imageMimeType?: string;
  imageSizeBytes?: number;
  content: string;
  tags: string[];
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

const BlogSchema = new Schema<BlogDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    authorName: { type: String, required: true, trim: true },
    authorId: { type: String },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String },
    imageFilename: { type: String },
    imageMimeType: { type: String },
    imageSizeBytes: { type: Number },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    publishDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Blog: Model<BlogDocument> =
  (models.Blog as Model<BlogDocument>) ||
  model<BlogDocument>("Blog", BlogSchema);
