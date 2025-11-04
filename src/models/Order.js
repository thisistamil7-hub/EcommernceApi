const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            variant: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" }, // ✅ optional
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    paymentMethod: { type: String, enum: ["card", "upi", "cod"], default: "cod" },
    paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    deliveredAt: Date,
}, { timestamps: true });
module.exports = mongoose.model("Order", OrderSchema)
