import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { OrderLine } from "../entity/OrderLine";
import { Not } from "typeorm";
import { orderLineRoutes } from '../orderLine.routes';
import { OrderLineStatus } from "../entity/OrderLineStatus";
import { SocketController } from "./SocketController";
import { Order } from "../entity/Order";
import { Product } from "../entity/Product";

export class OrderLineController {

    private orderLineRepository = AppDataSource.getRepository(OrderLine)

    async getOrderLinesByNoStatusAndRoom(request: Request, response: Response, next: NextFunction) {
        const status = (request.params.status);
        const room = (request.params.room);
        try {

            const orderLines = await this.orderLineRepository.createQueryBuilder('orderLine')
                // 1. Relacions que SÍ volem que apareguen al JSON (totes les seqüències)
                .leftJoinAndSelect('orderLine.product', 'product')
                .leftJoinAndSelect('product.elaborationSequences', 'allSequences')
                .leftJoinAndSelect('allSequences.section', 'allSections')

                // 2. Filtre d'estat
                .where('orderLine.status != :status', { status: status })

                // 3. FILTRE DE CERCA (La "clau"): 
                // Fem un Join extra (sense Select) per filtrar el producte, 
                // però sense afectar a les relacions 'allSequences' carregades dalt.
                .innerJoin('product.elaborationSequences', 'searchSequence')
                .innerJoin('searchSequence.section', 'searchSection')
                .andWhere('searchSection.name = :room', { room: room })
                .getMany();

            if (orderLines && orderLines.length > 0) {
                response.status(200).json({
                    "message": "order lines retieved successfully",
                    "object": orderLines
                });
            } else {
                response.status(404).json({
                    "message": "order lines not found",
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

    // orderlines / status /:orderLineStatus/room/:room"
    async getOrderLinesByStatusAndRoom(request: Request, response: Response, next: NextFunction) {
        const status = (request.params.status);
        const room = (request.params.room);
        const currentSectionSequence = (request.params.currentSectionSequence);
        try {
            const orderLines = await this.orderLineRepository.find({
                where: {
                    status: status,
                    product: {
                        elaborationSequences: {
                            section: {
                                name: room // El filtre que busques
                            }
                        }
                    }
                },
                relations: {
                    product: {
                        elaborationSequences: {
                            section: true
                        }
                    }
                }
            });
            if (orderLines && orderLines.length > 0) {
                orderLines.filter(ol => ol.currentSectionSequence == ol.product.elaborationSequences[ol.currentSectionSequence].sectionOrder);
                response.status(200).json({
                    "message": "order lines retieved successfully",
                    "object": orderLines
                });
            } else {
                response.status(404).json({
                    "message": "order lines not found",
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

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const orderlines = await this.orderLineRepository.find()
            response.status(200).json({
                "message": "list orderlines retieved successfully",
                "object": orderlines
            });
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
            const user = await this.orderLineRepository.findOne({
                where: { id }
            })
            if (user) {
                response.status(200).json({
                    "message": "order line retieved successfully",
                    "object": user
                });
            } else {
                response.status(404).json({
                    "message": "order line not found",
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

    private async changeStatus(orderLine: OrderLine): Promise<OrderLine> {
        console.log("Canviant estat de la línia d'ordre amb id " + orderLine.id + " i estat actual " + orderLine.status);
        switch (orderLine.status) {
            case OrderLineStatus.PENDING:
                orderLine.status = OrderLineStatus.PREPARING;
                break;
            case OrderLineStatus.PREPARING:
                orderLine.status = OrderLineStatus.READY;
                break
            case OrderLineStatus.READY:
                orderLine.status = OrderLineStatus.SERVED;
                if (orderLine.product.elaborationSequences.length == (orderLine.currentSectionSequence + 1)) {
                    //es lultima seccio
                    console.log("La línia d'ordre és a l'última secció, canviant estat a SERVED.");

                } else {
                    //no es lultima seccio
                    console.log("La línia d'ordre no és a l'última secció, avançant a la següent secció.");
                    //abans de canviar de seccio, cal enviar notificació de SERVED a la secció actual per a que l'esborre de la seva llista
                    console.log("Enviant notificació de SERVED a la secció actual abans de canviar...");
                    const section = orderLine.product.elaborationSequences[orderLine.currentSectionSequence].section.name;
                    await SocketController.sendMessageToRoom(section, 'new_orderLine', orderLine);
                    console.log("Canvie de secció de la línia d'ordre. Passe de " + section + " a la següent.");
                    orderLine.currentSectionSequence += 1;
                    orderLine.status = OrderLineStatus.PENDING;
                }
                break;
        }
        return orderLine;
    }

    async saveNextStatus(request: Request, response: Response, next: NextFunction) {
        const { id } = request.body;

        let orderLine = await this.orderLineRepository.findOne({
            where: { id },
            relations: {
                product: {
                    elaborationSequences: {
                        section: true
                    }
                },
                order: true
            }
        });

        if (!orderLine) {
            response.status(404).json({
                "message": "OrderLine not found",
                "object": null
            });
            return;
        }

        orderLine = await this.changeStatus(orderLine);

        try {
            await this.orderLineRepository.save(orderLine)
            response.status(200).json({
                "message": "OrderLine saved successfully",
                "object": orderLine
            });
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { id, unityPrice, status, currentSectionSequence } = request.body;

        let orderLine: OrderLine;

        if (id) {
            orderLine = await this.orderLineRepository.findOne({
                where: { id },
                relations: {
                    product: true,
                    order: true
                }
            });

            if (!orderLine) {
                response.status(404).json({
                    "message": "OrderLine not found",
                    "object": null
                });
                return;
            }

            orderLine.unityPrice = unityPrice;
            orderLine.status = status;
            orderLine.currentSectionSequence = currentSectionSequence;

        } else {
            orderLine = new OrderLine();
            orderLine.unityPrice = unityPrice;
            orderLine.status = status;
            orderLine.currentSectionSequence = currentSectionSequence;
        }

        try {
            await this.orderLineRepository.save(orderLine)
            response.status(200).json({
                "message": "OrderLine saved successfully",
                "object": orderLine
            });
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        try {
            let orderLineToRemove = await this.orderLineRepository.findOneBy({ id })

            if (!orderLineToRemove) {
                response.status(400).json({
                    "message": "Order Line with id " + id + " doesn't existe",
                    "object": null
                });
            } else {
                await this.orderLineRepository.remove(orderLineToRemove)
                response.status(200).json({
                    "message": "Order Line removed successfully",
                    "object": orderLineToRemove
                });
            }
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });
        }
    }

    async addProductToTable(request: Request, response: Response) {
        const { tableId, productId, unityPrice } = request.body;

        try {
            const orderRepository = AppDataSource.getRepository(Order);
            const productRepository = AppDataSource.getRepository(Product);

            const order = await orderRepository.findOne({
                where: {
                    table: { id: tableId },
                    status: 'Opened'
                },
                relations: { table: true }
            });

            if (!order) {
                return response.status(404).json({
                    message: 'No active order for this table',
                    object: null
                });
            }

            const product = await productRepository.findOne({
                where: { id: productId },
                relations: {
                    elaborationSequences: {
                        section: true
                    }
                }
            });

            if (!product) {
                return response.status(404).json({
                    message: 'Product not found',
                    object: null
                });
            }

            const orderLine = new OrderLine();
            orderLine.order = order;
            orderLine.product = product;
            orderLine.unityPrice = unityPrice;
            orderLine.status = OrderLineStatus.PENDING;
            orderLine.currentSectionSequence = 0;

            await this.orderLineRepository.save(orderLine);

            const section = product.elaborationSequences[0].section.name;
            SocketController.sendMessageToRoom(section, 'new_orderLine', orderLine);

            return response.status(200).json({
                message: 'Product added to order successfully',
                object: orderLine
            });

        } catch (error) {
            return response.status(500).json({
                message: error.message,
                object: error
            });
        }
    }
}
