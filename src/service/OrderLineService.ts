import { AppDataSource } from "../data-source";
import { OrderLine } from "../entity/OrderLine";
import { OrderLineStatus } from "../entity/OrderLineStatus";
import { Order } from "../entity/Order";
import { Product } from "../entity/Product";
import { SocketController } from "../controller/SocketController";

export class OrderLineService {

    private orderLineRepository = AppDataSource.getRepository(OrderLine);
    private orderRepository = AppDataSource.getRepository(Order);
    private productRepository = AppDataSource.getRepository(Product);

    async getAll(): Promise<OrderLine[]> {
        return await this.orderLineRepository.find();
    }

    async getOne(id: number): Promise<OrderLine | null> {
        return await this.orderLineRepository.findOne({ where: { id } });
    }

    async save(orderLine: OrderLine): Promise<OrderLine> {
        return await this.orderLineRepository.save(orderLine);
    }

    async delete(id: number): Promise<boolean> {
        const ol = await this.getOne(id);
        if (!ol) return false;
        await this.orderLineRepository.remove(ol);
        return true;
    }

    // =========================
    // Cambio de estado
    // =========================
    async nextStatus(id: number): Promise<OrderLine | null> {

        let orderLine = await this.orderLineRepository.findOne({
            where: { id },
            relations: {
                product: {
                    elaborationSequences: {
                        section: true
                    }
                }
            }
        });

        if (!orderLine) return null;

        switch (orderLine.status) {
            case OrderLineStatus.PENDING:
                orderLine.status = OrderLineStatus.PREPARING;
                break;

            case OrderLineStatus.PREPARING:
                orderLine.status = OrderLineStatus.READY;
                break;

            case OrderLineStatus.READY:
                if (orderLine.product.elaborationSequences.length === orderLine.currentSectionSequence + 1) {
                    orderLine.status = OrderLineStatus.SERVED;
                } else {
                    const section =
                        orderLine.product.elaborationSequences[orderLine.currentSectionSequence].section.name;

                    await SocketController.sendMessageToRoom(section, 'remove_orderLine', orderLine);

                    orderLine.currentSectionSequence++;
                    orderLine.status = OrderLineStatus.PENDING;
                }
                break;
        }

        return await this.orderLineRepository.save(orderLine);
    }

    // =========================
    // Añadir producto a mesa
    // =========================
    async addProductToTable(
        tableId: number,
        productId: number,
        unityPrice: number
    ): Promise<OrderLine | null> {

        const order = await this.orderRepository.findOne({
            where: { table: { id: tableId }, status: "Opened" },
            relations: { table: true }
        });

        if (!order) return null;

        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: {
                elaborationSequences: {
                    section: true
                }
            }
        });

        if (!product) return null;

        const orderLine = new OrderLine();
        orderLine.order = order;
        orderLine.product = product;
        orderLine.unityPrice = unityPrice;
        orderLine.status = OrderLineStatus.PENDING;
        orderLine.currentSectionSequence = 0;

        const saved = await this.orderLineRepository.save(orderLine);

        const section = product.elaborationSequences[0].section.name;
        SocketController.sendMessageToRoom(section, 'new_orderLine', saved);

        return saved;
    }
}
