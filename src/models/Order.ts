import mongoose, { Model, Document, Schema, Types } from "mongoose";


interface IAddress {
  street: string,
  city: string,
  state: string,
  postalCode: string,
  country: string,

}
interface IOrderItemVariant {
  stock: number;
  variantID: string;
  value: string;
  name: string;
}
interface orderItems {
  product: Types.ObjectId;
  variant: IOrderItemVariant[];
  quantity: number;
  price: number;

}
export interface Iorder extends Document {
  user: Types.ObjectId;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  notes: string;
  invoiceNo: string;
  orderItems: orderItems[];
  paymentMethod: string;
  shippingAddress: IAddress;
  status: string;
  deliveredAt: Date;



}
const OrderSchema = new Schema<Iorder>(
  {
    // Customer / User info
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // reference to your customers table
      required: true,
    },

    // Order details
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        variant: [{
          VariantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Variant"
          },
          name: String,
          value: String,

        }],

        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    // Billing & payment
    totalAmount: { type: Number, required: true },
    advanceAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 }, // calculated = total - advance
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "cod"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "success", "failed"],
      default: "pending",
    },

    // Address / Delivery
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    // Status tracking
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    deliveredAt: Date,

    // Optional for reporting/invoice
    invoiceNo: { type: String },
    notes: { type: String },

  },
  { timestamps: true }
);

// 🧮 Auto-calculate remaining amount before saving
OrderSchema.pre("save", function (next) {
  this.remainingAmount = this.totalAmount - this.advanceAmount;
  next();
});
export const Order: Model<Iorder> = mongoose.model<Iorder>("Order", OrderSchema);

