import { AppDataSource } from "../data-source";
import { Order } from "../entity/Order";
import { Table } from "../entity/Table";

export class OrderService {

    private orderRepository = AppDataSource.getRepository(Order);
    private tableRepository = AppDataSource.getRepository(Table);


    // GetOrder
    async GetOrder(id: number): Promise<Order | null> {
        return await this.orderRepository.findOne({
            where: { id },
            relations: {
                table: true,
                orderLines: {
                    product: true
                }
            }
        });
    }

    // GetOrders
    async GetOrders(): Promise<Order[]> {
        return await this.orderRepository.find({
            relations: {
                table: true,
                orderLines: {
                    product: true
                }
            }
        });
    }

    // SaveOrder (crear o actualizar)
    async SaveOrder(order: Order): Promise<Order> {
        return await this.orderRepository.save(order);
    }

    // DeleteOrder
    async DeleteOrder(id: number): Promise<boolean> {
        const order = await this.GetOrder(id);

        if (!order) {
            return false;
        }

        await this.orderRepository.remove(order);
        return true;
    }


    // Obtener comanda activa de una mesa
    async GetActiveOrderByTable(tableId: number): Promise<Order | null> {
        return await this.orderRepository.findOne({
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
    }

    // Abrir comanda para una mesa
    async OpenOrderForTable(tableId: number): Promise<Order | null> {

        const table = await this.tableRepository.findOne({
            where: { id: tableId }
        });

        if (!table) {
            return null;
        }

        // ¿Ya existe comanda abierta?
        const existingOrder = await this.GetActiveOrderByTable(tableId);
        if (existingOrder) {
            return existingOrder;
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

        return newOrder;
    }
}
