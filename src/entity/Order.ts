import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, AfterInsert } from "typeorm"
import { OrderLine } from "./OrderLine"
import { Enterprise } from "./Enterprise"
import { Table } from "./Table"
import { SocketController } from "../controller/SocketController"

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    date: Date

    @Column()
    totalPrice: number

    @Column()
    status: String

    @OneToMany(() => OrderLine, (orderLine) => orderLine.order, { cascade: true, onDelete: 'CASCADE' })
    orderLines: OrderLine[]
    @ManyToOne(() => Enterprise, (enterprise) => enterprise.orders)
    enterprise: Enterprise
    @ManyToOne(() => Table, (table) => table.orders)
    table: Table
    @AfterInsert()
    adviseOrder() {
        this.sendOrderToRooms();
    }
    private sendOrderToRooms() {

        // 1. Identifiquem quines seccions hi ha en aquesta comanda
        // Això crea un array d'estils: ['cuina', 'barra'] sense duplicats
        const seccionsPresent = [...new Set(this.orderLines.map(ol => ol.product.elaborationSequences[ol.currentSectionSequence].section.name))];

        // 2. Per a cada secció trobada, filtrem i enviem
        seccionsPresent.forEach(seccio => {
            const liniesDeLaSeccio = this.orderLines.filter(ol => ol.product.elaborationSequences[ol.currentSectionSequence].section.name === seccio);
            if (liniesDeLaSeccio.length > 0) {
                SocketController.sendMessageToRoom(seccio, 'noves_linies', {
                    taula: this.table.name,
                    hora: new Date(),
                    linies: liniesDeLaSeccio // Només les línies d'eixa secció específica
                });
            }
        });
    }
}