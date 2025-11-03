const Order = require('../models/Order');
const Variant = require('../models/Variant');

exports.createOrder = async (orderData) => {
    const { user, items } = orderData;

    let totalAmount = 0;

    for (const item of items) {
        const variant = await Variant.findById(item.variant);

        if (!variant || variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${variant?.sku}`);
        }

        totalAmount += variant.price * item.quantity;

        // Decrease stock
        variant.stock -= item.quantity;
        await variant.save();
    }

    // Create the order
    const order = await Order.create({
        user,
        items,
        totalAmount
    });

    return order;
};
