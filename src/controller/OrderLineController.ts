import { Request, Response } from "express";
import { OrderLineService } from "../service/OrderLineService";

export class OrderLineController {

    private orderLineService = new OrderLineService();

    async all(req: Request, res: Response) {
        const orderLines = await this.orderLineService.getAll();
        res.status(200).json({ message: "OrderLines recuperats", object: orderLines });
    }

    async one(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const ol = await this.orderLineService.getOne(id);

        if (!ol) {
            return res.status(404).json({ message: "OrderLine no trobat", object: null });
        }

        res.status(200).json({ message: "OrderLine recuperat", object: ol });
    }

    async save(req: Request, res: Response) {
        const orderLine = await this.orderLineService.save(req.body);
        res.status(200).json({ message: "OrderLine guardat", object: orderLine });
    }

    async remove(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const deleted = await this.orderLineService.delete(id);

        if (!deleted) {
            return res.status(404).json({ message: "OrderLine no trobat", object: null });
        }

        res.status(200).json({ message: "OrderLine eliminat" });
    }

    async nextStatus(req: Request, res: Response) {
        const { id } = req.body;

        const ol = await this.orderLineService.nextStatus(id);
        if (!ol) {
            return res.status(404).json({ message: "OrderLine no trobat", object: null });
        }

        res.status(200).json({ message: "OrderLine actualitzat", object: ol });
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
                message: "Taula o producte no trobats o no nia ordre activa",
                object: null
            });
        }

        res.status(201).json({
            message: "Producte afegit a la taula",
            object: ol
        });
    }

    async getOrderLinesByStatusAndRoom(req: Request, res: Response) {
    const { status, room } = req.params;

    const orderLines =
        await this.orderLineService.GetOrderLinesByStatusAndRoom(status, room);

    if (!orderLines || orderLines.length === 0) {
        return res.status(404).json({
            message: "No hi ha línies d'ordre",
            object: null
        });
    }

    res.status(200).json({
        message: "OrderLines recuperats correctament",
        object: orderLines
    });
    }
    async getOrderLinesByNoStatusAndRoom(req: Request, res: Response) {
    const { status, room } = req.params;

    const orderLines =
        await this.orderLineService.GetOrderLinesByNoStatusAndRoom(status, room);

    if (!orderLines || orderLines.length === 0) {
        return res.status(404).json({
            message: "No hi ha línies d'ordre",
            object: null
        });
    }

    res.status(200).json({
        message: "OrderLines recuperats correctament",
        object: orderLines
    });
    }
}
