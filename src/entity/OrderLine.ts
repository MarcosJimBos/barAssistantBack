import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, AfterInsert, AfterUpdate, BeforeRemove } from "typeorm"
import { Product } from "./Product"
import { Order } from "./Order"
import { SocketController } from '../controller/SocketController';
import { OrderLineStatus } from "./OrderLineStatus";


@Entity()
export class OrderLine {

    @PrimaryGeneratedColumn()
    id: number
    @Column({
        type: 'enum',
        enum: OrderLineStatus,
        default: OrderLineStatus.PENDING
    })
    status: OrderLineStatus
    @Column()
    unityPrice: number
    @Column({ default: 0 })
    currentSectionSequence: number
    @ManyToOne(() => Product, (product => product.orderLines))
    product: Product
    @ManyToOne(() => Order, (order => order.orderLines))
    order: Order
    //@ManyToOne(() => Enterprise, enterprise => enterprise.orderLines)
    //enterprise: Enterprise
    @AfterUpdate()
    adviseStatusChange() {
        //if (this.status != OrderLineStatus.SERVED) {
        console.log("🚀 línia d'ordre actualitzada" + new Date() + ", enviant notificació...");
        this.sendLineToRoom(this);
        //}
    }
    @AfterInsert()
    adviseOrderLine() {
        console.log("🚀 Nova línia d'ordre creada" + new Date() + ", enviant notificació...");
        this.sendLineToRoom(this);
    }
    private sendLineToRoom(orderLine: OrderLine) {
        var section;
        // 1. Identifiquem quines seccions hi ha en aquesta comanda
        // Això crea un array d'estils: ['cuina', 'barra'] sense duplicats
        console.log("🚀 Enviant línia d'ordre " + orderLine + " a la secció corresponent...");
        if (orderLine.product && orderLine.product.elaborationSequences
            && orderLine.product.elaborationSequences.length > 0 && orderLine.currentSectionSequence < orderLine.product.elaborationSequences.length) {
            section = orderLine.product.elaborationSequences[orderLine.currentSectionSequence].section.name;
        }
        else {
            throw Error("La línia d'ordre no té producte o seqüències d'elaboració associades.");
        }
        console.log("🚀 La línia d'ordre pertany a la secció:", section);
        // 2. Per a cada secció trobada, filtrem i enviem

        SocketController.sendMessageToRoom(section, 'new_orderLine',
            //taula: orderLine.order.table.name,
            orderLine
            //date: new Date(),
            //orderLinia: orderLine // Només les línies d'eixa secció específica
        );
    }

}