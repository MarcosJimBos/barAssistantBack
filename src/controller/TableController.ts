import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Order } from "../entity/Order";
import { Table } from "../entity/Table";

export class TableController {

    private orderRepository = AppDataSource.getRepository(Order);
    private tableRepository = AppDataSource.getRepository(Table);

    // 1️⃣ GET comanda activa
    async getActiveOrder(req: Request, res: Response) {
        const tableId = parseInt(req.params.tableId);

        try {
            const activeOrder = await this.orderRepository.findOne({
                where: {
                    table: { id: tableId },
                    status: "Opened"
                },
                relations: {
                    table: true,
                    orderLines: {
                        product: true
                    }
                }
            });

            return res.status(200).json({
                message: activeOrder
                    ? "Active order retrieved"
                    : "No active order for this table",
                object: activeOrder ?? null
            });

        } catch (error) {
            return res.status(500).json({
                message: "Error retrieving active order",
                error
            });
        }
    }

    // 2️⃣ POST abrir comanda
    async openOrder(req: Request, res: Response) {
        const tableId = parseInt(req.params.tableId);

        try {
            const table = await this.tableRepository.findOne({
                where: { id: tableId }
            });

            if (!table) {
                return res.status(404).json({
                    message: "Table not found",
                    object: null
                });
            }

            const existingOrder = await this.orderRepository.findOne({
                where: {
                    table: { id: tableId },
                    status: "Opened"
                },
                relations: {
                    orderLines: true
                }
            });

            if (existingOrder) {
                return res.status(200).json({
                    message: "Active order already exists",
                    object: existingOrder
                });
            }

            const newOrder = new Order();
            newOrder.date = new Date();
            newOrder.status = "Opened";
            newOrder.totalPrice = 0;
            newOrder.table = table;
            newOrder.orderLines = [];

            table.status = "Occupied";
            await this.tableRepository.save(table);
            await this.orderRepository.save(newOrder);

            return res.status(201).json({
                message: "Order opened successfully",
                object: newOrder
            });

        } catch (error) {
            return res.status(500).json({
                message: "Error opening order",
                error
            });
        }
    }
}
