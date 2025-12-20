import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug?: string;
  description: string;
  category: Types.ObjectId;
  user: Types.ObjectId;
  basePrice: number;
  image: string;
  brand: string;
}
const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: String
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  basePrice: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

// Automatically generate slug
ProductSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

export const Product: Model<IProduct> = mongoose.model('Product', ProductSchema);
