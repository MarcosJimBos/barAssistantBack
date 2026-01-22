import { Request, Response } from "express";
import { OrderService } from "../service/OrderService";
import { Order } from "../entity/Order";

export class OrderController {

    private orderService = new OrderService();

    // =====================
    // GET todas las comandas
    // =====================
    async all(req: Request, res: Response) {
        try {
            const orders = await this.orderService.GetOrders();
            res.status(200).json({
                message: "Comandes recuperades correctament",
                object: orders
            });
        } catch (error) {
            res.status(500).json({
                message: "Error recuperant les comandes",
                error
            });
        }
    }

    // =====================
    // GET comanda per id
    // =====================
    async one(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Id no vàlid",
                object: null
            });
        }

        const order = await this.orderService.GetOrder(id);

        if (!order) {
            return res.status(404).json({
                message: "Comanda no trobada",
                object: null
            });
        }

        res.status(200).json({
            message: "Comanda recuperada correctament",
            object: order
        });
    }

    // =====================
    // POST guardar comanda
    // =====================
    async save(req: Request, res: Response) {
        try {
            const order = Object.assign(new Order(), req.body);

            const savedOrder = await this.orderService.SaveOrder(order);

            res.status(200).json({
                message: "Comanda guardada correctament",
                object: savedOrder
            });
        } catch (error) {
            res.status(500).json({
                message: "Error al guardar la comanda",
                error
            });
        }
    }

    // =====================
    // DELETE comanda
    // =====================
    async remove(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Id no vàlid",
                object: null
            });
        }

        const deleted = await this.orderService.DeleteOrder(id);

        if (!deleted) {
            return res.status(404).json({
                message: "Comanda no trobada",
                object: null
            });
        }

        res.status(200).json({
            message: "Comanda eliminada correctament"
        });
    }

    // =====================
    // GET comanda activa per taula
    // =====================
    async getActiveOrderByTable(req: Request, res: Response) {
        const tableId = parseInt(req.params.tableId);

        if (isNaN(tableId)) {
            return res.status(400).json({
                message: "Id de taula no vàlid",
                object: null
            });
        }

        const order = await this.orderService.GetActiveOrderByTable(tableId);

        if (!order) {
            return res.status(404).json({
                message: "No hi ha comanda activa per aquesta taula",
                object: null
            });
        }

        res.status(200).json({
            message: "Comanda activa recuperada",
            object: order
        });
    }

    // =====================
    // POST obrir comanda per taula (opcional però top)
    // =====================
    async openOrderForTable(req: Request, res: Response) {
        const tableId = parseInt(req.params.tableId);

        if (isNaN(tableId)) {
            return res.status(400).json({
                message: "Id de taula no vàlid",
                object: null
            });
        }

        const order = await this.orderService.OpenOrderForTable(tableId);

        if (!order) {
            return res.status(404).json({
                message: "No s'ha pogut obrir la comanda",
                object: null
            });
        }

        res.status(201).json({
            message: "Comanda oberta correctament",
            object: order
        });
    }
}
