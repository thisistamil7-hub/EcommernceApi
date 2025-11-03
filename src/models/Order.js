const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
            price: Number,
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
    paymentStatus: { type: String, default: "pending" },
    totalAmount: Number,
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
}, { timestamps: true });
module.exports = mongoose.model("Order", OrderSchema)