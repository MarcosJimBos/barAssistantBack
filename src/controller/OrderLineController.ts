import { Request, Response } from "express";
import { OrderLineService } from "../service/OrderLineService";

export class OrderLineController {

    private orderLineService = new OrderLineService();

    async all(req: Request, res: Response) {
        const orderLines = await this.orderLineService.getAll();
        res.status(200).json({ message: "OrderLines retrieved", object: orderLines });
    }

    async one(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const ol = await this.orderLineService.getOne(id);

        if (!ol) {
            return res.status(404).json({ message: "OrderLine not found", object: null });
        }

        res.status(200).json({ message: "OrderLine retrieved", object: ol });
    }

    async save(req: Request, res: Response) {
        const orderLine = await this.orderLineService.save(req.body);
        res.status(200).json({ message: "OrderLine saved", object: orderLine });
    }

    async remove(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const deleted = await this.orderLineService.delete(id);

        if (!deleted) {
            return res.status(404).json({ message: "OrderLine not found", object: null });
        }

        res.status(200).json({ message: "OrderLine removed" });
    }

    async nextStatus(req: Request, res: Response) {
        const { id } = req.body;

        const ol = await this.orderLineService.nextStatus(id);
        if (!ol) {
            return res.status(404).json({ message: "OrderLine not found", object: null });
        }

        res.status(200).json({ message: "OrderLine updated", object: ol });
    }

    async addProductToTable(req: Request, res: Response) {
        const { tableId, productId, unityPrice } = req.body;

        const ol = await this.orderLineService.addProductToTable(
            tableId,
            productId,
            unityPrice
        );

        if (!ol) {
            return res.status(404).json({
                message: "Table or product not found or no active order",
                object: null
            });
        }

        res.status(201).json({
            message: "Product added to order",
            object: ol
        });
    }
}
