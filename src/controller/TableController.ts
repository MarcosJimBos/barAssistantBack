import { Request, Response } from "express";
import { TableService } from "../service/TableService";
import { OrderService } from "../service/OrderService";

export class TableController {

    private tableService = new TableService();
    private orderService = new OrderService();

    // =====================
    // GET todas las mesas
    // =====================
    async all(req: Request, res: Response) {
        try {
            const tables = await this.tableService.GetTables();

            return res.status(200).json({
                message: "Taules recuperades correctament",
                object: tables
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error recuperant les taules",
                error
            });
        }
    }

    // =====================
    // GET una mesa por ID
    // =====================
    async one(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Id de taula invàlid",
                object: null
            });
        }

        try {
            const table = await this.tableService.GetTable(id);

            if (!table) {
                return res.status(404).json({
                    message: "Taula no trobada",
                    object: null
                });
            }

            return res.status(200).json({
                message: "Taula recuperada correctament",
                object: table
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error recuperant la taula",
                error
            });
        }
    }

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
