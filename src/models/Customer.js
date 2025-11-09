const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    totalSales: {
      type: Number,
      default: 0, // total of all order amounts
    },
    totalAdvance: {
      type: Number,
      default: 0, // total of all advances paid
    },
    totalRemaining: {
      type: Number,
      default: 0, // balance amount left to pay
    },
    ordersCount: {
      type: Number,
      default: 0, // number of total orders
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);
CustomerSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastCustomer = await mongoose
      .model("Customer")
      .findOne({}, { customerId: 1 })
      .sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastCustomer && lastCustomer.customerId) {
      const lastNumber = parseInt(
        lastCustomer.customerId.replace("CUS", ""),
        10
      );
      if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
    }

    this.customerId = "CUS" + nextNumber.toString().padStart(4, "0");
  }

  next();
});

module.exports = mongoose.model("Customer", CustomerSchema);
