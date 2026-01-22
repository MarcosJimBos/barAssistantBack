import { Request, Response } from "express";
import { OrderService } from "../service/OrderService";

export class OrderController {

    private orderService = new OrderService();

    async all(req: Request, res: Response) {
        try {
            const orders = await this.orderService.GetOrders();
            res.status(200).json({
                message: "Orders retrieved successfully",
                object: orders
            });
        } catch (error) {
            res.status(500).json({ message: "Error retrieving orders", error });
        }
    }

    async one(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        const order = await this.orderService.GetOrder(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found", object: null });
        }

        res.status(200).json({ message: "Order retrieved", object: order });
    }

    async save(req: Request, res: Response) {
        try {
            const order = await this.orderService.SaveOrder(req.body);
            res.status(200).json({
                message: "Order saved successfully",
                object: order
            });
        } catch (error) {
            res.status(500).json({ message: "Error saving order", error });
        }
    }

    async remove(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        const deleted = await this.orderService.DeleteOrder(id);
        if (!deleted) {
            return res.status(404).json({ message: "Order not found", object: null });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    }

    async getActiveOrderByTable(req: Request, res: Response) {
        const tableId = parseInt(req.params.tableId);

        const order = await this.orderService.GetActiveOrderByTable(tableId);
        res.status(200).json({
            message: "Active order retrieved",
            object: order
        });
    }
}
