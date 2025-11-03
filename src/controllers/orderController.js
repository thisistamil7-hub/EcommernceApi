const OrderService = require("../services/orderServices.js")

const OrderController = {
    CreateOrder: async (req, res) => {
        try {
            const order = await OrderService.createOrder(req.body)
            res.status(201).json({ message: 'Order created successfully' })

        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}
module.exports = OrderController