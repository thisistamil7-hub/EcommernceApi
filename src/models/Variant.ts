import mongoose, { Schema, Model, Document, Types } from 'mongoose';
export interface IVariant extends Document {
  productId: Types.ObjectId;
  sku: string;
  color?: string,
  size?: string,
  material?: string,
  image?: string,
  price: number;
  stock: number;
  isActive?: boolean;
}
const VariantSchema = new Schema<IVariant>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  color: String,
  size: String,
  material: String,
  image: String,
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });
export const Variant: Model<IVariant> = mongoose.model('Variant', VariantSchema);
