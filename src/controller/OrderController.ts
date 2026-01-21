import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Order } from "../entity/Order";


export class OrderController {

    private orderRepository = AppDataSource.getRepository(Order)

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const orders = await this.orderRepository.find({
                relations: { orderLines: { product: true }, table: true }
            })
            response.status(200).json({
                "message": "list orders retieved successfully",
                "object": orders
            });
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });
        }
    }
    async fullOrders(request: Request, response: Response, next: NextFunction) {
        try {
            const order = await this.orderRepository.find({
                relations: {
                    orderLines: {
                        product:
                        {
                            elaborationSequences: {
                                section: true
                            }
                        }
                    }
                }
            })
            if (order) {
                response.status(200).json({
                    "message": "order retieved successfully",
                    "object": order
                });
            } else {
                response.status(404).json({
                    "message": "order not found",
                    "object": null
                });
            }
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });
        }
    }
    async fullOrder(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        try {
            const order = await this.orderRepository.findOne({
                where: { id },
                relations: {
                    orderLines: {
                        product:
                        {
                            elaborationSequences: {
                                section: true
                            }
                        }
                    }
                }
            })
            if (order) {
                response.status(200).json({
                    "message": "order retieved successfully",
                    "object": order
                });
            } else {
                response.status(404).json({
                    "message": "order not found",
                    "object": null
                });
            }
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });
        }
    }
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        try {
            const order = await this.orderRepository.findOne({
                where: { id }
            })
            if (order) {
                response.status(200).json({
                    "message": "order retieved successfully",
                    "object": order
                });
            } else {
                response.status(404).json({
                    "message": "order not found",
                    "object": null
                });
            }

        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });
        }
    }
    async save(request: Request, response: Response, next: NextFunction) {
        const orderData = request.body;
        const order = Object.assign(new Order(), { orderData });
        try {
            await this.orderRepository.save(order)
            response.status(200).json({
                "message": "Order saved successfully",
                "object": order
            });
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });

        }
    }
    // Dins del teu controlador de comandes al servidor


    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        try {
            let orderToRemove = await this.orderRepository.findOneBy({ id })

            if (!orderToRemove) {
                response.status(400).json({
                    "message": "Order with id " + id + " doesn't existe",
                    "object": null
                });
            } else {
                await this.orderRepository.remove(orderToRemove)
                response.status(200).json({
                    "message": "Order removed successfully",
                    "object": orderToRemove
                });
            }
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });

        }
    }

    async getActiveOrderByTable(request: Request, response: Response) {
    const tableId = parseInt(request.params.tableId);

    if (isNaN(tableId)) {
        return response.status(400).json({
            message: "Invalid table id",
            object: null
        });
    }

    try {
        // 1️ Buscar comanda OBERTA per a la taula
        let order = await this.orderRepository.findOne({
            where: {
                table: { id: tableId },
                status: "Opened"
            },
            relations: {
                orderLines: {
                    product: true
                },
                table: true
            }
        });

        // 2️ Si no existeix, crear-la
        if (!order) {
            order = this.orderRepository.create({
                date: new Date(),
                status: "Opened",
                totalPrice: 0,
                table: { id: tableId }
            });

            await this.orderRepository.save(order);
        }

        // 3️ Tornar la comanda
        response.status(200).json({
            message: "Active order retrieved successfully",
            object: order
        });

    } catch (error: any) {
        response.status(500).json({
            message: error.detail || error.message,
            object: error
        });
    }
}


}