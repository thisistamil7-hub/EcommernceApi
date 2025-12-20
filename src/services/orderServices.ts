
import { Order, Iorder } from "../models/Order"
import { Variant } from "../models/Variant"

export const createOrder = async (orderData: Iorder) => {
  const { user, orderItems, shippingAddress, paymentMethod } = orderData;

  if (!orderItems || orderItems.length === 0) {
    throw new Error("No items in the order");
  }

  let totalAmount = 0;

  // Validate and update stock for each variant
  await Promise.all(
    orderItems.map(async (item) => {
      const variant = await Variant.findById(item.variant);

      if (!variant) {
        throw new Error(`Variant not found for item: ${item.variant}`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for SKU: ${variant.sku}`);
      }

      totalAmount += variant.price * item.quantity;

      // Decrease stock
      variant.stock -= item.quantity;
      await variant.save();
    })
  );

  // Create order document
  const order = await Order.create({
    user,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
  });

  return order;
};
