import { Request, Response } from "express";
import { TableService } from "../service/TableService";
import { OrderService } from "../service/OrderService";

export class TableController {

    private tableService = new TableService();
    private orderService = new OrderService();

    // =====================
    // GET comanda activa
    // =====================
    async getActiveOrder(req: Request, res: Response) {
        const tableId = parseInt(req.params.tableId);

        try {
            const activeOrder = await this.orderService.GetActiveOrderByTable(tableId);

            return res.status(200).json({
                message: activeOrder
                    ? "Comanda activa recuperada"
                    : "No hi ha comanda activa per aquesta taula",
                object: activeOrder
            });

        } catch (error) {
            return res.status(500).json({
                message: "Error amb la comanda activa",
                error
            });
        }
    }

    // =====================
    // POST abrir comanda
    // =====================
    async openOrder(req: Request, res: Response) {
        const tableId = parseInt(req.params.tableId);

        try {
            const order = await this.orderService.OpenOrderForTable(tableId);

            if (!order) {
                return res.status(404).json({
                    message: "Taula no trobada o ja té una comanda activa",
                    object: null
                });
            }

            return res.status(201).json({
                message: "Comanda oberta correctament",
                object: order
            });

        } catch (error) {
            return res.status(500).json({
                message: "Error obrint la comanda",
                error
            });
        }
    }
}
