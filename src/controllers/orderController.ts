import { createOrder } from "../services/orderServices"
import { Response, Request } from "express"
export const OrderController = {
    CreateOrder: async (req: Request, res: Response) => {
        try {
            const order = await createOrder(req.body)
            res.status(201).json({ message: 'Order created successfully' })
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "unknown error " });
            }
        }
    }

}
