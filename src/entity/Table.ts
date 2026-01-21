import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Order } from "./Order"

@Entity()
export class Table {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    capacity: number
    @Column()
    status: string
    @OneToMany(() => Order, (order) => order.table)
    orders: Order[]

}